import { useEffect } from 'react';
import { useGameStore } from '@munchkin/shared';
import { supabase } from '../lib/supabase';

export function useRealtimeGame(gameId: string | null) {
  const { updatePlayerLevel } = useGameStore();

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const updated = payload.new as { id: string; level: number };
          updatePlayerLevel(updated.id, updated.level);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [gameId, updatePlayerLevel]);
}
