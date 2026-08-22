import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, getGameById } from '@munchkin/shared';
import type { GamePlayerWithInfo, SortMode } from '@munchkin/shared';
import { supabase } from '@/lib/supabase';
import { PlayerGrid } from '@/components/PlayerGrid/PlayerGrid';
import { SortDropdown } from '@/components/SortDropdown/SortDropdown';
import { GameTimer } from '@/components/GameTimer/GameTimer';
import { DiceButton } from '@/components/DiceButton/DiceButton';
import { NarratorButton } from '@/components/NarratorButton/NarratorButton';
import { useTTS } from '@/hooks/useTTS';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { translations } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';
import { NOTEBOOKLM_URL } from '@/lib/constants';

function shuffleIds(ids: string[]): string[] {
  const arr = [...ids];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i] as string;
    arr[i] = arr[j] as string;
    arr[j] = tmp;
  }
  return arr;
}

export default function SpectatePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Awaited<ReturnType<typeof getGameById>>>(null);
  const [players, setPlayers] = useState<GamePlayerWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('level-desc');
  const [randomOrder, setRandomOrder] = useState<string[]>([]);

  useRealtimeGame(supabase, gameId ?? null);

  // Limpa o store ao sair da página para não poluir a sessão do usuário logado
  useEffect(() => {
    return () => { useGameStore.setState({ gamePlayers: [] }); };
  }, []);

  // Sincroniza updates realtime com o estado local
  const { gamePlayers, isTransDungeonActive } = useGameStore();
  const { isSupported, isSpeaking, speak, stop } = useTTS();
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

  // Embaralhar quando sortMode muda para 'random'
  useEffect(() => {
    if (sortMode === 'random' && players.length > 0) {
      setRandomOrder(shuffleIds(players.map((p) => p.id)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode]);

  const handleNarrate = () => {
    if (isSpeaking) { stop(); return; }
    const sorted = [...players].sort((a, b) => b.level - a.level);
    const text = sorted
      .map((p) => {
        if (isTransDungeonActive && p.female_name) {
          return `${p.player.name} como ${p.female_name} nível ${p.level}`;
        }
        return `${p.player.name} nível ${p.level}`;
      })
      .join('. ');
    speak(text);
  };

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

  // Ordem de exibição conforme o modo de visualização escolhido (mesmas opções do modo logado)
  const displayedPlayers = (() => {
    if (sortMode === 'level-desc') {
      return [...players].sort((a, b) => b.level - a.level);
    }
    if (sortMode === 'random' && randomOrder.length > 0) {
      return randomOrder
        .map((id) => players.find((p) => p.id === id))
        .filter((p): p is GamePlayerWithInfo => p !== undefined);
    }
    return players;
  })();

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

      {/* Opções de visualização — mesmas do modo logado (ordenação + grade/lista) */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SortDropdown sortMode={sortMode} onSortChange={setSortMode} />
        </div>
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
          gamePlayers={displayedPlayers}
          maxLevel={game.max_level}
          victoryLevel={game.victory_level}
          sortMode={sortMode}
          isOwner={false}
          isTransActive={isTransDungeonActive}
          onLevelChange={() => undefined}
          viewMode={viewMode}
        />
      </div>

      {/* Barra de informações: timer + acesso rápido */}
      <div className="flex items-center gap-2 flex-wrap">
        <GameTimer startedAt={game.started_at} />
        <div className="flex items-center gap-2 ml-auto">
          <a
            href="/rules"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver regras do Munchkin"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-card border border-parchment-dim/30 hover:border-brand-gold/50 font-heading text-xs text-parchment-muted hover:text-parchment transition-colors"
          >
            <span aria-hidden>📖</span>
            <span>Regras</span>
          </a>
          <a
            href={NOTEBOOKLM_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir NotebookLM das regras"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-card border border-parchment-dim/30 hover:border-brand-gold/50 font-heading text-xs text-parchment-muted hover:text-parchment transition-colors"
          >
            <span aria-hidden>🎙</span>
            <span>NotebookLM</span>
          </a>
        </div>
      </div>

      {/* Barra de ações principais (70% Narrar, 30% Dado) */}
      <div className="flex items-stretch gap-3 w-full">
        <div className="w-[70%]">
          <NarratorButton
            isSupported={isSupported}
            isSpeaking={isSpeaking}
            onClick={handleNarrate}
          />
        </div>
        <div className="w-[30%]">
          <DiceButton />
        </div>
      </div>
    </div>
  );
}
