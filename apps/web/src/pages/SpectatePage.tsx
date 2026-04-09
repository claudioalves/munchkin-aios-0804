import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, getGameById } from '@munchkin/shared';
import type { GamePlayerWithInfo } from '@munchkin/shared';
import { supabase } from '@/lib/supabase';
import { PlayerGrid } from '@/components/PlayerGrid/PlayerGrid';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { translations } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';

export default function SpectatePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Awaited<ReturnType<typeof getGameById>>>(null);
  const [players, setPlayers] = useState<GamePlayerWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        const data = await getGameById(supabase, gameId!);
        if (!data) { setError('Partida não encontrada ou já encerrada.'); return; }

        setGame(data);
        const gps = data.game_players as GamePlayerWithInfo[];
        setPlayers(gps);
        // Coloca no store para o hook realtime atualizar
        useGameStore.setState({ gamePlayers: gps });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Falha ao carregar a partida.');
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // t() local baseado no idioma do criador da partida
  const spectatorLang = ((game as { lang?: string } | null)?.lang as Language) ?? 'pt-BR';
  const tSpectate = (key: string): string => {
    return (translations[spectatorLang] as Record<string, string>)[key]
      ?? (translations['pt-BR'] as Record<string, string>)[key]
      ?? key;
  };

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
        <span>{tSpectate('game.spectator')}</span>
      </div>

      {/* Toggle grid/lista */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setViewMode('grid')}
          aria-label="Mudar para grade"
          className={`p-2 rounded-lg font-heading text-xs transition-colors ${
            viewMode === 'grid'
              ? 'bg-brand-gold text-surface-base'
              : 'text-parchment-muted hover:text-parchment bg-surface-card'
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => setViewMode('list')}
          aria-label="Mudar para lista"
          className={`p-2 rounded-lg font-heading text-xs transition-colors ${
            viewMode === 'list'
              ? 'bg-brand-gold text-surface-base'
              : 'text-parchment-muted hover:text-parchment bg-surface-card'
          }`}
        >
          ☰
        </button>
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
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
