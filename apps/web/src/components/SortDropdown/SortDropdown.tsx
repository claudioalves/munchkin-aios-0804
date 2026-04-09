import type { SortMode } from '@munchkin/shared';

interface SortDropdownProps {
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
}

const OPTIONS: { mode: SortMode; label: string; icon: string }[] = [
  { mode: 'level-desc', label: 'Por Nível', icon: '🏆' },
  { mode: 'random', label: 'Aleatório', icon: '🔀' },
  { mode: 'custom', label: 'Personalizado', icon: '↕️' },
];

export function SortDropdown({ sortMode, onSortChange }: SortDropdownProps) {
  return (
    <div className="flex gap-1 bg-surface-card rounded-xl p-1">
      {OPTIONS.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => onSortChange(mode)}
          className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-heading text-xs transition-colors
            ${sortMode === mode
              ? 'bg-brand-gold text-surface-base font-semibold'
              : 'text-parchment-muted hover:text-parchment hover:bg-surface-elevated'
            }`}
        >
          <span>{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
