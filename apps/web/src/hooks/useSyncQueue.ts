import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { updateLevel, STORAGE_KEYS } from '@munchkin/shared';

interface QueuedWrite {
  gamePlayerId: string;
  level: number;
  timestamp: string;
}

const flushQueue = async () => {
  const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
  if (!raw) return;
  let queue: QueuedWrite[];
  try {
    queue = JSON.parse(raw) as QueuedWrite[];
  } catch {
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    return;
  }
  if (!queue.length) return;

  // Remove queue before processing to avoid duplicates
  localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);

  for (const write of queue) {
    await updateLevel(supabase, write.gamePlayerId, write.level).catch((e) => {
      console.error('Sync queue flush failed for write:', write, e);
    });
  }
};

export function enqueueWrite(gamePlayerId: string, level: number) {
  const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) ?? '[]';
  let queue: QueuedWrite[];
  try {
    queue = JSON.parse(raw) as QueuedWrite[];
  } catch {
    queue = [];
  }
  queue.push({ gamePlayerId, level, timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
}

export function useSyncQueue() {
  useEffect(() => {
    const handleOnline = () => void flushQueue();
    window.addEventListener('online', handleOnline);

    // Flush imediato se já online com fila pendente
    if (navigator.onLine) void flushQueue();

    return () => window.removeEventListener('online', handleOnline);
  }, []);
}
