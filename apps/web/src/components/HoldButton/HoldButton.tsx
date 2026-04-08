import { useRef, useState } from 'react';

interface HoldButtonProps {
  holdDuration?: number;
  onComplete: () => void;
  label?: string;
}

export function HoldButton({
  holdDuration = 3000,
  onComplete,
  label = 'Segurar 3s para encerrar',
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / holdDuration, 1);
      setProgress(p);
      if (p >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete();
      }
    }, 16);
  };

  const cancelHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  return (
    <button
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      className="relative h-16 w-full max-w-xs mx-auto rounded-xl border-2 border-brand-ruby
        text-brand-ruby font-heading font-semibold text-sm
        select-none touch-none overflow-hidden
        hover:border-brand-ruby-light transition-colors flex items-center justify-center"
    >
      {/* Fundo de progresso */}
      <div
        className="absolute inset-0 bg-brand-ruby origin-left"
        style={{ transform: `scaleX(${progress})`, transition: progress === 0 ? 'none' : undefined }}
      />
      <span className={`relative z-10 ${progress > 0.5 ? 'text-parchment' : ''}`}>
        {label}
      </span>
    </button>
  );
}
