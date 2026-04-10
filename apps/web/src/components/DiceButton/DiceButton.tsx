import { useState } from 'react';

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;
const ROLL_DURATION_MS = 700;

export function DiceButton() {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    setTimeout(() => {
      const n = Math.floor(Math.random() * 6) + 1;
      setResult(n);
      setRolling(false);
    }, ROLL_DURATION_MS);
  };

  const face = result ? DICE_FACES[result - 1] : '🎲';

  return (
    <button
      onClick={roll}
      disabled={rolling}
      title="Rolar dado"
      aria-label="Rolar dado"
      className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-card border border-parchment-dim/30 hover:border-brand-gold/60 transition-colors min-w-[52px] gap-0.5 disabled:opacity-60"
    >
      <span
        className={`text-2xl leading-none select-none ${rolling ? 'animate-dice-roll' : ''}`}
        aria-hidden
      >
        {face}
      </span>
      <span className="font-heading text-xs text-parchment-muted leading-none">
        {rolling ? '...' : result ? String(result) : 'dado'}
      </span>
    </button>
  );
}
