import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, getGameById, ensureAnonymousSession } from '@munchkin/shared';
import type { GamePlayerWithInfo } from '@munchkin/shared';
import { supabase } from '@/lib/supabase';
import { PlayerGrid } from '@/components/PlayerGrid/PlayerGrid';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';

export default function SpectatePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { setUserId } = useGameStore();
  const [game, setGame] = useState<Awaited<ReturnType<typeof getGameById>>>(null);
  const [players, setPlayers] = useState<GamePlayerWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useRealtimeGame(supabase, gameId ?? null);

  // Sincroniza updates realtime com o estado local
  const { gamePlayers } = useGameStore();
  useEffect(() => {
    if (gamePlayers.length > 0) setPlayers(gamePlayers);
  }, [gamePlayers]);

  useEffect(() => {
    if (!gameId) { navigate('/'); return; }

    async function load() {
      try {
        // Garante sessão anônima — espectador não precisa de conta
        const user = await ensureAnonymousSession(supabase);
        setUserId(user.id);

        const data = await getGameById(supabase, gameId!);
        if (!data) { setError('Partida não encontrada ou já encerrada.'); return; }

        setGame(data);
        const gps = data.game_players as GamePlayerWithInfo[];
        setPlayers(gps);
        // Coloca no store para o hook realtime atualizar
        useGameStore.setState({ gamePlayers: gps });
      } catch {
        setError('Falha ao carregar a partida.');
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center gap-4 p-8">
        <span className="text-4xl">⚔️</span>
        <p className="font-heading text-parchment-muted text-center">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="font-heading text-brand-gold text-sm hover:underline"
        >
          Ir para o início
        </button>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="min-h-screen bg-surface-base flex flex-col p-4 gap-4 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-3 px-1">
        <button
          onClick={() => navigate('/')}
          className="font-heading text-parchment-muted hover:text-parchment transition-colors text-sm"
        >
          ← Início
        </button>
        <div className="text-center">
          <h1 className="font-display text-brand-gold text-lg leading-none">Munchkin</h1>
          <p className="font-body text-parchment-dim text-xs">
            {game.epic_mode ? 'Épico ★' : 'Normal'} · {players.length} jogadores
          </p>
        </div>
        <div className="w-14" />
      </header>

      {/* Banner espectador */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-brand-gold/30 text-parchment-muted text-xs font-heading tracking-wide">
        <span>👁</span>
        <span>Modo espectador — apenas visualizando</span>
      </div>

      {/* Grid somente leitura */}
      <div className="flex-1">
        <PlayerGrid
          gamePlayers={players}
          maxLevel={game.max_level}
          victoryLevel={game.victory_level}
          sortMode="level-desc"
          isOwner={false}
          onLevelChange={() => undefined}
        />
      </div>
    </div>
  );
}
