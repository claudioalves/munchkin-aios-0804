import { supabase } from '@/lib/supabase';
import { updateLevel, useGameStore } from '@munchkin/shared';
import { enqueueWrite } from './useSyncQueue';

export function useLevelUpdate() {
  const { activeGame, updatePlayerLevel } = useGameStore();

  return (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => {
    const maxLevel = activeGame?.max_level ?? 10;
    const newLevel = currentLevel + delta;

    if (newLevel < 1 || newLevel > maxLevel) return;

    // Optimistic — instantâneo (< 100ms)
    updatePlayerLevel(gamePlayerId, newLevel);

    // Persist async com rollback ou enqueue se offline
    updateLevel(supabase, gamePlayerId, newLevel).catch(() => {
      if (!navigator.onLine) {
        enqueueWrite(gamePlayerId, newLevel);
      } else {
        // Online mas falhou: rollback
        updatePlayerLevel(gamePlayerId, currentLevel);
      }
    });
  };
}
