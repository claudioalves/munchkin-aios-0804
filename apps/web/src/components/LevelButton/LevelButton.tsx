interface LevelButtonProps {
  variant: 'increment' | 'decrement';
  disabled?: boolean;
  onClick: () => void;
  'aria-label': string;
  /**
   * 'flex' (default) stretches to fill its flex parent — used in the grid card,
   * where the button is one of only two siblings and gets plenty of room.
   * 'fixed' locks a comfortable square tap target instead of relying on
   * leftover flex space — used in the list row, where several sibling
   * elements (rank badge, name, level number) would otherwise squeeze the
   * button down to an unusably thin sliver on narrow mobile screens.
   */
  layout?: 'flex' | 'fixed';
}

export function LevelButton({
  variant,
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  layout = 'flex',
}: LevelButtonProps) {
  const isIncrement = variant === 'increment';
  const sizeClasses =
    layout === 'fixed'
      ? 'flex-shrink-0 w-[53px] h-[53px]'
      : 'flex-1 h-16';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${sizeClasses} rounded-lg font-bold text-2xl select-none touch-none
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
