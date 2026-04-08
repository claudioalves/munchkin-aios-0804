import { supabase } from '@/lib/supabase';
import { updateLevel, useGameStore } from '@munchkin/shared';

export function useLevelUpdate() {
  const { activeGame, updatePlayerLevel } = useGameStore();

  return (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => {
    const maxLevel = activeGame?.max_level ?? 10;
    const newLevel = currentLevel + delta;

    if (newLevel < 1 || newLevel > maxLevel) return;

    // Optimistic — instantâneo (< 100ms)
    updatePlayerLevel(gamePlayerId, newLevel);

    // Persist async com rollback
    updateLevel(supabase, gamePlayerId, newLevel).catch(() => {
      updatePlayerLevel(gamePlayerId, currentLevel);
    });
  };
}
