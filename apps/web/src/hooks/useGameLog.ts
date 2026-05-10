import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getGameEvents } from '@munchkin/shared';
import type { GameEvent } from '@munchkin/shared';

export function useGameLog(gameId: string | null) {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    setIsLoading(true);
    getGameEvents(supabase, gameId)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, [gameId]);

  return { events, isLoading };
}
