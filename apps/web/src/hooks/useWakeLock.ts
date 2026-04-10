import { useEffect, useRef } from 'react';

interface WakeLockHandle {
  release(): Promise<void>;
  addEventListener(type: string, listener: () => void): void;
}

export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockHandle | null>(null);

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let cancelled = false;

    const acquire = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).wakeLock
        .request('screen')
        .then((lock: WakeLockHandle) => {
          if (cancelled) {
            lock.release().catch(() => {});
            return;
          }
          wakeLockRef.current = lock;
          lock.addEventListener('release', () => {
            wakeLockRef.current = null;
          });
        })
        .catch(() => {});
    };

    acquire();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && active && !wakeLockRef.current) {
        acquire();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [active]);
}
