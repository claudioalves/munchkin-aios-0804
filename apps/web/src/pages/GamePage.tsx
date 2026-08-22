import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { arrayMove } from '@dnd-kit/sortable';
import { supabase } from '@/lib/supabase';
import {
  getActiveGame,
  finishGame,
  updateGameOrder,
  useGameStore,
  STORAGE_KEYS,
  captureSnapshot,
} from '@munchkin/shared';
import type { GamePlayerWithInfo } from '@munchkin/shared';
import { PlayerGrid } from '@/components/PlayerGrid/PlayerGrid';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import { HoldButton } from '@/components/HoldButton/HoldButton';
import { VictoryModal } from '@/components/VictoryModal/VictoryModal';
import { NarratorButton } from '@/components/NarratorButton/NarratorButton';
import { ProgressChart } from '@/components/ProgressChart/ProgressChart';
import { SortDropdown } from '@/components/SortDropdown/SortDropdown';
import { GameTimer } from '@/components/GameTimer/GameTimer';
import { DiceButton } from '@/components/DiceButton/DiceButton';
import { GameOptionsModal } from '@/components/GameOptionsModal/GameOptionsModal';
import { TransDungeonModal } from '@/components/TransDungeonModal/TransDungeonModal';
import { PlayerProfileModal } from '@/components/PlayerProfileModal/PlayerProfileModal';
import { useLevelUpdate } from '@/hooks/useLevelUpdate';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useTTS } from '@/hooks/useTTS';
import { useSnapshots } from '@/hooks/useSnapshots';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { useWakeLock } from '@/hooks/useWakeLock';
import { ShareModal } from '@/components/ShareModal/ShareModal';
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

export default function GamePage() {
  const navigate = useNavigate();
  const {
    userId,
    activeGame,
    gamePlayers,
    sortMode,
    viewMode,
    isTransDungeonActive,
    setActiveGame,
    setGamePlayers,
    setGamePlayersOrder,
    setSortMode,
    setViewMode,
    setTransDungeonActive,
    setAllFemaleNames,
    setPlayerFemaleName,
    clearGame,
  } = useGameStore();
  const isOwner = !!userId && !!activeGame && userId === activeGame.owner_id;
  useRealtimeGame(supabase, activeGame?.id ?? null);
  useWakeLock(!!activeGame);
  const handleLevelChange = useLevelUpdate();
  const { isSupported, isSpeaking, speak, stop } = useTTS();
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [selectedPlayerForModal, setSelectedPlayerForModal] = useState<GamePlayerWithInfo | null>(null);
  const [randomOrder, setRandomOrder] = useState<string[]>([]);
  const { snapshots } = useSnapshots(activeGame?.id);
  const initialSnapshotDone = useRef(false);

  useAutoSave();
  useSyncQueue();

  useEffect(() => {
    if (activeGame) return;
    getActiveGame(supabase)
      .then((game) => {
        if (!game) { navigate('/'); return; }
        setActiveGame(game);
        setGamePlayers(game.game_players);
      })
      .catch(() => navigate('/'));
  }, [activeGame, navigate, setActiveGame, setGamePlayers]);

  // Snapshot inicial ao entrar na partida (Story 7.1)
  useEffect(() => {
    if (!activeGame || gamePlayers.length === 0 || initialSnapshotDone.current) return;
    initialSnapshotDone.current = true;
    void captureSnapshot(supabase, activeGame.id, gamePlayers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame?.id]);

  // Embaralhar quando sortMode muda para 'random' (Story 8.3)
  useEffect(() => {
    if (sortMode === 'random' && gamePlayers.length > 0) {
      setRandomOrder(shuffleIds(gamePlayers.map((p) => p.id)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode]);

  if (!activeGame) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  // Compute displayed order based on sortMode (Story 8.3)
  const displayedPlayers = (() => {
    if (sortMode === 'level-desc') {
      return [...gamePlayers].sort((a, b) => b.level - a.level);
    }
    if (sortMode === 'random' && randomOrder.length > 0) {
      return randomOrder
        .map((id) => gamePlayers.find((p) => p.id === id))
        .filter((p): p is (typeof gamePlayers)[0] => p !== undefined);
    }
    return gamePlayers;
  })();

  const winner = gamePlayers.find((p) => p.level >= activeGame.victory_level);

  const handleFinish = async () => {
    await finishGame(supabase, activeGame.id);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    clearGame();
    navigate('/');
  };

  const handleNarrate = () => {
    if (isSpeaking) { stop(); return; }
    const sorted = [...gamePlayers].sort((a, b) => b.level - a.level);
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

  const handleReorder = (activeId: string, overId: string) => {
    const oldIndex = gamePlayers.findIndex((p) => p.id === activeId);
    const newIndex = gamePlayers.findIndex((p) => p.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(gamePlayers, oldIndex, newIndex);
    setGamePlayersOrder(newOrder.map((p) => p.id));
    void updateGameOrder(supabase, activeGame.id, newOrder.map((p) => p.id));
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col p-4 gap-4 max-w-2xl mx-auto">
      <AppHeader
        epicMode={activeGame.epic_mode}
        playerCount={gamePlayers.length}
        onBack={() => navigate('/')}
        onOptionsOpen={() => setIsOptionsOpen(true)}
        onLogOpen={() => navigate('/game/log')}
        onChartOpen={() => setIsChartOpen(true)}
        onShareOpen={() => setIsShareOpen(true)}
      />

      {!isOwner && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-card border border-brand-gold/30 text-parchment-muted text-xs font-heading tracking-wide">
          <span>👁</span>
          <span>Modo espectador — apenas visualizando</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SortDropdown sortMode={sortMode} onSortChange={setSortMode} />
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          aria-label={viewMode === 'grid' ? 'Mudar para lista' : 'Mudar para grade'}
          className={`p-2 rounded-lg font-heading text-xs transition-colors ${
            viewMode === 'grid'
              ? 'bg-brand-gold text-surface-base'
              : 'text-parchment-muted hover:text-parchment bg-surface-card'
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          aria-label={viewMode === 'list' ? 'Mudar para grade' : 'Mudar para lista'}
          className={`p-2 rounded-lg font-heading text-xs transition-colors ${
            viewMode === 'list'
              ? 'bg-brand-gold text-surface-base'
              : 'text-parchment-muted hover:text-parchment bg-surface-card'
          }`}
        >
          ☰
        </button>
      </div>

      <div className="flex-1">
        <PlayerGrid
          gamePlayers={displayedPlayers}
          maxLevel={activeGame.max_level}
          victoryLevel={activeGame.victory_level}
          sortMode={sortMode}
          isOwner={isOwner}
          isTransActive={isTransDungeonActive}
          onLevelChange={handleLevelChange}
          onReorder={handleReorder}
          onPlayerClick={(gpId) => {
            const found = gamePlayers.find((p) => p.id === gpId);
            if (found) setSelectedPlayerForModal(found);
          }}
          viewMode={viewMode}
        />
      </div>

      {/* Barra de informações: timer + acesso rápido */}
      <div className="flex items-center gap-2 flex-wrap">
        <GameTimer startedAt={activeGame.started_at} />
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

      {/* Botão de encerrar no final da página (rolar para acessar) */}
      {isOwner && (
        <div className="pt-10 pb-8 mt-6 border-t border-parchment-dim/15 flex flex-col items-center justify-center gap-2">
          <HoldButton onComplete={() => void handleFinish()} />
        </div>
      )}

      {winner && (
        <VictoryModal
          winner={winner}
          onFinish={handleFinish}
        />
      )}

      {isShareOpen && (
        <ShareModal gameId={activeGame.id} onClose={() => setIsShareOpen(false)} />
      )}

      {isChartOpen && (
        <ProgressChart
          snapshots={snapshots}
          gamePlayers={gamePlayers}
          maxLevel={activeGame.max_level}
          onClose={() => setIsChartOpen(false)}
        />
      )}

      <GameOptionsModal
        isOpen={isOptionsOpen}
        isTransActive={isTransDungeonActive}
        onClose={() => setIsOptionsOpen(false)}
        onToggleTrans={(active) => {
          setTransDungeonActive(active);
          if (active) {
            setIsTransModalOpen(true);
          }
        }}
        onEditTransNames={() => {
          setIsOptionsOpen(false);
          setIsTransModalOpen(true);
        }}
      />

      <TransDungeonModal
        isOpen={isTransModalOpen}
        gamePlayers={gamePlayers}
        onClose={() => setIsTransModalOpen(false)}
        onSave={(femaleNamesMap) => {
          setAllFemaleNames(femaleNamesMap);
        }}
      />

      <PlayerProfileModal
        gp={selectedPlayerForModal}
        isTransActive={isTransDungeonActive}
        onClose={() => setSelectedPlayerForModal(null)}
        onSaveFemaleName={(gamePlayerId, femaleName) => {
          setPlayerFemaleName(gamePlayerId, femaleName);
        }}
      />
    </div>
  );
}
