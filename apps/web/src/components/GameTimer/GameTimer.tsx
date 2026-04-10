import { useEffect, useState } from 'react';

interface GameTimerProps {
  startedAt: string;
}

function formatElapsed(seconds: number): string {
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function formatStartTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function GameTimer({ startedAt }: GameTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const update = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface-card border border-parchment-dim/20 text-xs font-heading text-parchment-muted">
      <span title="Hora de início">
        🕐 <span className="text-parchment">{formatStartTime(startedAt)}</span>
      </span>
      <span className="text-parchment-dim">·</span>
      <span title="Duração da partida">
        ⏱ <span className="text-parchment">{formatElapsed(elapsed)}</span>
      </span>
    </div>
  );
}
