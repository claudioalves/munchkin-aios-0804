-- =============================================================
-- MIGRATION 001 — Munchkin Level Tracker: Initial Schema
-- =============================================================

-- =============================================================
-- TABELA: players
-- Jogadores cadastrados pelo usuário (persistem entre partidas)
-- =============================================================
CREATE TABLE public.players (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id   UUID NOT NULL DEFAULT auth.uid(),
    name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 30),
    color      TEXT NOT NULL CHECK (color ~ '^#[0-9a-fA-F]{6}$'),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_players_owner ON public.players (owner_id);

-- =============================================================
-- TABELA: games
-- Uma partida de Munchkin (ativa ou finalizada)
-- =============================================================
CREATE TABLE public.games (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id      UUID NOT NULL DEFAULT auth.uid(),
    epic_mode     BOOLEAN NOT NULL DEFAULT false,
    max_level     INT GENERATED ALWAYS AS (CASE WHEN epic_mode THEN 20 ELSE 10 END) STORED,
    victory_level INT GENERATED ALWAYS AS (CASE WHEN epic_mode THEN 21 ELSE 11 END) STORED,
    status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'finished')),
    player_order  JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_mode     TEXT NOT NULL DEFAULT 'level-desc' CHECK (sort_mode IN ('level-desc', 'random', 'custom')),
    started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at   TIMESTAMPTZ
);

-- Apenas uma partida ativa por owner
CREATE UNIQUE INDEX idx_games_active_owner
    ON public.games (owner_id) WHERE status = 'active';

CREATE INDEX idx_games_owner_status ON public.games (owner_id, status);

-- =============================================================
-- TABELA: game_players
-- Relação M:N entre games e players, com nível atual
-- =============================================================
CREATE TABLE public.game_players (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id    UUID NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
    player_id  UUID NOT NULL REFERENCES public.players (id) ON DELETE CASCADE,
    level      INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    position   INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (game_id, player_id)
);

CREATE INDEX idx_game_players_game ON public.game_players (game_id);

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_game_players_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_game_players_updated
    BEFORE UPDATE ON public.game_players
    FOR EACH ROW
    EXECUTE FUNCTION update_game_players_timestamp();

-- =============================================================
-- TABELA: level_snapshots
-- Snapshots periódicos para o gráfico de progresso (a cada 15min)
-- =============================================================
CREATE TABLE public.level_snapshots (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id     UUID NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
    player_id   UUID NOT NULL REFERENCES public.players (id) ON DELETE CASCADE,
    level       INT NOT NULL CHECK (level >= 1),
    captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snapshots_game_time
    ON public.level_snapshots (game_id, captured_at);

-- =============================================================
-- REALTIME: habilitar nas tabelas necessárias
-- =============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_snapshots ENABLE ROW LEVEL SECURITY;

-- players: owner vê e gerencia apenas seus jogadores
CREATE POLICY "players_select_own"
    ON public.players FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "players_insert_own"
    ON public.players FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "players_update_own"
    ON public.players FOR UPDATE
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "players_delete_own"
    ON public.players FOR DELETE
    USING (owner_id = auth.uid());

-- games: owner vê e gerencia apenas suas partidas
CREATE POLICY "games_select_own"
    ON public.games FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "games_insert_own"
    ON public.games FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "games_update_own"
    ON public.games FOR UPDATE
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "games_delete_own"
    ON public.games FOR DELETE
    USING (owner_id = auth.uid());

-- game_players: acesso via ownership do game pai
CREATE POLICY "game_players_select_via_game"
    ON public.game_players FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = game_players.game_id
            AND games.owner_id = auth.uid()
        )
    );

CREATE POLICY "game_players_insert_via_game"
    ON public.game_players FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = game_players.game_id
            AND games.owner_id = auth.uid()
        )
    );

CREATE POLICY "game_players_update_via_game"
    ON public.game_players FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = game_players.game_id
            AND games.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = game_players.game_id
            AND games.owner_id = auth.uid()
        )
    );

CREATE POLICY "game_players_delete_via_game"
    ON public.game_players FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = game_players.game_id
            AND games.owner_id = auth.uid()
        )
    );

-- level_snapshots: acesso via ownership do game pai
CREATE POLICY "snapshots_select_via_game"
    ON public.level_snapshots FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = level_snapshots.game_id
            AND games.owner_id = auth.uid()
        )
    );

CREATE POLICY "snapshots_insert_via_game"
    ON public.level_snapshots FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = level_snapshots.game_id
            AND games.owner_id = auth.uid()
        )
    );

-- =============================================================
-- TRIGGER: validar limite de nível de acordo com o modo do jogo
-- =============================================================
CREATE OR REPLACE FUNCTION check_level_limit()
RETURNS TRIGGER AS $$
DECLARE
    game_max_level INT;
BEGIN
    SELECT max_level INTO game_max_level
    FROM public.games
    WHERE id = NEW.game_id;

    IF NEW.level > game_max_level THEN
        RAISE EXCEPTION 'Level % exceeds max_level % for this game', NEW.level, game_max_level;
    END IF;

    IF NEW.level < 1 THEN
        RAISE EXCEPTION 'Level cannot be less than 1';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_level_limit
    BEFORE INSERT OR UPDATE ON public.game_players
    FOR EACH ROW
    EXECUTE FUNCTION check_level_limit();
