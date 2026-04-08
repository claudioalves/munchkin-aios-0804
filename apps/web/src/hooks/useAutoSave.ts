import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { captureSnapshot, useGameStore, GAME_CONFIG } from '@munchkin/shared';

export function useAutoSave() {
  const { activeGame } = useGameStore();

  // Refs para capturar estado mais recente sem reiniciar o interval
  const gamePlayersRef = useRef(useGameStore.getState().gamePlayers);
  const setLastSavedAtRef = useRef(useGameStore.getState().setLastSavedAt);

  useEffect(() => {
    return useGameStore.subscribe((state) => {
      gamePlayersRef.current = state.gamePlayers;
      setLastSavedAtRef.current = state.setLastSavedAt;
    });
  }, []);

  useEffect(() => {
    if (!activeGame) return;

    const interval = setInterval(async () => {
      try {
        await captureSnapshot(supabase, activeGame.id, gamePlayersRef.current);
        setLastSavedAtRef.current(new Date().toISOString());
      } catch (e) {
        console.error('Auto-save snapshot failed:', e);
      }
    }, GAME_CONFIG.SNAPSHOT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeGame]);
}
