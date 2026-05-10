-- =============================================================
-- MIGRATION 004 — game_events: log de eventos da partida
-- =============================================================

CREATE TABLE public.game_events (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id     UUID         NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    player_id   UUID         REFERENCES public.players(id) ON DELETE SET NULL,
    player_name TEXT         NOT NULL,
    event_type  TEXT         NOT NULL CHECK (event_type IN ('level_up', 'level_down', 'game_start', 'game_end')),
    old_value   INT,
    new_value   INT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_game_events_game ON public.game_events (game_id, created_at DESC);

ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;

-- Leitura pública (espectadores também podem ver o log)
CREATE POLICY "game_events_select" ON public.game_events
    FOR SELECT USING (true);

-- Escrita apenas pelo dono da partida
CREATE POLICY "game_events_insert" ON public.game_events
    FOR INSERT WITH CHECK (
        auth.uid() = (SELECT owner_id FROM public.games WHERE id = game_id)
    );
