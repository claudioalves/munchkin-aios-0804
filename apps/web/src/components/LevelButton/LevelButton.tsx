interface LevelButtonProps {
  variant: 'increment' | 'decrement';
  disabled?: boolean;
  onClick: () => void;
  'aria-label': string;
}

export function LevelButton({
  variant,
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
}: LevelButtonProps) {
  const isIncrement = variant === 'increment';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`flex-1 h-16 rounded-lg font-bold text-2xl select-none touch-none
        transition-all duration-75 ease-out active:scale-90
        disabled:opacity-30 disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-brand-gold focus-visible:outline-offset-2
        ${isIncrement
          ? 'bg-brand-gold text-surface-base hover:bg-brand-gold-light'
          : 'bg-brand-ruby text-parchment hover:bg-brand-ruby-light'
        }`}
    >
      {isIncrement ? '+' : '−'}
    </button>
  );
}
