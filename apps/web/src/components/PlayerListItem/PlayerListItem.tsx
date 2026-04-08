import type { Player } from '@munchkin/shared';

interface PlayerListItemProps {
  player: Player;
  onDelete?: (id: string) => void;
}

export function PlayerListItem({ player, onDelete }: PlayerListItemProps) {
  return (
    <li className="flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-surface-base text-sm font-bold flex-shrink-0"
        style={{ backgroundColor: player.color }}
      >
        {player.name[0]?.toUpperCase()}
      </div>
      <span className="font-body text-parchment text-lg flex-1 truncate">
        {player.name}
      </span>
      {onDelete && (
        <button
          onClick={() => onDelete(player.id)}
          className="w-8 h-8 flex items-center justify-center text-parchment-dim hover:text-brand-ruby transition-colors rounded-lg hover:bg-surface-elevated"
          aria-label={`Remover ${player.name}`}
        >
          ×
        </button>
      )}
    </li>
  );
}
