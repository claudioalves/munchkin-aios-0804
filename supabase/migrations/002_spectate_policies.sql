-- =============================================================
-- MIGRATION 002 — Spectate: leitura pública de partidas ativas
-- =============================================================
-- Permite que qualquer pessoa (autenticada ou não) leia
-- uma partida ativa pelo ID, habilitando o modo espectador.
-- A policy de SELECT do owner é mantida e esta complementa.
-- =============================================================

-- games: qualquer um pode ler uma partida com status 'active'
CREATE POLICY "games_select_active_public"
    ON public.games FOR SELECT
    USING (status = 'active');

-- game_players: qualquer um pode ler os game_players
-- se a partida pai estiver ativa
CREATE POLICY "game_players_select_active_public"
    ON public.game_players FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE games.id = game_players.game_id
            AND games.status = 'active'
        )
    );

-- players: qualquer um pode ler um jogador se ele estiver
-- em uma partida ativa (necessário para o join do espectador)
CREATE POLICY "players_select_in_active_game"
    ON public.players FOR SELECT
    USING (
        id IN (
            SELECT gp.player_id
            FROM public.game_players gp
            JOIN public.games g ON g.id = gp.game_id
            WHERE g.status = 'active'
        )
    );
