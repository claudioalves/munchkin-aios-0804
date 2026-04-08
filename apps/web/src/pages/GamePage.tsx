import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getActiveGame, finishGame, useGameStore, STORAGE_KEYS, captureSnapshot } from '@munchkin/shared';
import { PlayerGrid } from '@/components/PlayerGrid/PlayerGrid';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import { HoldButton } from '@/components/HoldButton/HoldButton';
import { VictoryModal } from '@/components/VictoryModal/VictoryModal';
import { NarratorButton } from '@/components/NarratorButton/NarratorButton';
import { ProgressChart } from '@/components/ProgressChart/ProgressChart';
import { useLevelUpdate } from '@/hooks/useLevelUpdate';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useTTS } from '@/hooks/useTTS';
import { useSnapshots } from '@/hooks/useSnapshots';

export default function GamePage() {
  const navigate = useNavigate();
  const { activeGame, gamePlayers, setActiveGame, setGamePlayers, clearGame } = useGameStore();
  const handleLevelChange = useLevelUpdate();
  const { isSupported, isSpeaking, speak, stop } = useTTS();
  const [isChartOpen, setIsChartOpen] = useState(false);
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

  if (!activeGame) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

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
    const text = sorted.map((p) => `${p.player.name} nível ${p.level}`).join('. ');
    speak(text);
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col p-4 gap-4 max-w-2xl mx-auto">
      <AppHeader
        epicMode={activeGame.epic_mode}
        playerCount={gamePlayers.length}
        onBack={() => navigate('/')}
        onChartOpen={() => setIsChartOpen(true)}
      />

      <div className="flex-1">
        <PlayerGrid
          gamePlayers={gamePlayers}
          maxLevel={activeGame.max_level}
          victoryLevel={activeGame.victory_level}
          onLevelChange={handleLevelChange}
        />
      </div>

      <div className="pb-4 flex items-center gap-3">
        <div className="flex-1">
          <HoldButton onComplete={() => void handleFinish()} />
        </div>
        <NarratorButton
          isSupported={isSupported}
          isSpeaking={isSpeaking}
          onClick={handleNarrate}
        />
      </div>

      {winner && (
        <VictoryModal
          winner={winner}
          onFinish={handleFinish}
        />
      )}

      {isChartOpen && (
        <ProgressChart
          snapshots={snapshots}
          gamePlayers={gamePlayers}
          maxLevel={activeGame.max_level}
          onClose={() => setIsChartOpen(false)}
        />
      )}
    </div>
  );
}
