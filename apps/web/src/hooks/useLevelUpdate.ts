import { supabase } from '@/lib/supabase';
import { updateLevel, useGameStore, logEvent } from '@munchkin/shared';
import { enqueueWrite } from './useSyncQueue';

export function useLevelUpdate() {
  const { activeGame, gamePlayers, updatePlayerLevel } = useGameStore();

  return (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => {
    const maxLevel = activeGame?.max_level ?? 10;
    const newLevel = currentLevel + delta;

    if (newLevel < 1 || newLevel > maxLevel) return;

    updatePlayerLevel(gamePlayerId, newLevel);

    const gp = gamePlayers.find((p) => p.id === gamePlayerId);

    updateLevel(supabase, gamePlayerId, newLevel)
      .then(() => {
        if (activeGame && gp) {
          void logEvent(supabase, {
            game_id: activeGame.id,
            player_id: gp.player_id,
            player_name: gp.player.name,
            event_type: delta > 0 ? 'level_up' : 'level_down',
            old_value: currentLevel,
            new_value: newLevel,
          });
        }
      })
      .catch(() => {
        if (!navigator.onLine) {
          enqueueWrite(gamePlayerId, newLevel);
        } else {
          updatePlayerLevel(gamePlayerId, currentLevel);
        }
      });
  };
}
