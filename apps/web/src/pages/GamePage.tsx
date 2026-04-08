import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getActiveGame, finishGame, useGameStore, STORAGE_KEYS } from '@munchkin/shared';
import { PlayerGrid } from '@/components/PlayerGrid/PlayerGrid';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import { HoldButton } from '@/components/HoldButton/HoldButton';
import { VictoryModal } from '@/components/VictoryModal/VictoryModal';
import { useLevelUpdate } from '@/hooks/useLevelUpdate';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export default function GamePage() {
  const navigate = useNavigate();
  const { activeGame, gamePlayers, setActiveGame, setGamePlayers, clearGame } = useGameStore();
  const handleLevelChange = useLevelUpdate();

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

  return (
    <div className="min-h-screen bg-surface-base flex flex-col p-4 gap-4 max-w-2xl mx-auto">
      <AppHeader
        epicMode={activeGame.epic_mode}
        playerCount={gamePlayers.length}
        onBack={() => navigate('/')}
      />

      <div className="flex-1">
        <PlayerGrid
          gamePlayers={gamePlayers}
          maxLevel={activeGame.max_level}
          victoryLevel={activeGame.victory_level}
          onLevelChange={handleLevelChange}
        />
      </div>

      <div className="pb-4">
        <HoldButton onComplete={() => void handleFinish()} />
      </div>

      {winner && (
        <VictoryModal
          winner={winner}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}
