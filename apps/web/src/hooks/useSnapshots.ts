import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getSnapshots } from '@munchkin/shared';
import type { LevelSnapshot } from '@munchkin/shared';

export function useSnapshots(gameId: string | undefined) {
  const [snapshots, setSnapshots] = useState<LevelSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!gameId) return;
    setIsLoading(true);
    getSnapshots(supabase, gameId)
      .then(setSnapshots)
      .catch(() => setSnapshots([]))
      .finally(() => setIsLoading(false));
  }, [gameId]);

  return { snapshots, isLoading };
}
