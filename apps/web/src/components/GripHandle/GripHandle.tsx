import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';

interface GripHandleProps {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  className?: string;
  'aria-label': string;
}

/**
 * Six-dot drag grip. Only this element receives the dnd-kit drag
 * listeners, so dragging a player to reorder requires grabbing the
 * handle specifically — taps elsewhere on the card/row (name, level
 * buttons, progress bar) never get mistaken for a drag gesture.
 */
export function GripHandle({ attributes, listeners, className = '', 'aria-label': ariaLabel }: GripHandleProps) {
  return (
    <div
      {...attributes}
      {...listeners}
      aria-label={ariaLabel}
      className={`flex-shrink-0 grid grid-cols-2 gap-[3px] place-items-center p-2 -m-2 rounded-lg
        cursor-grab active:cursor-grabbing touch-none select-none
        text-parchment-dim hover:text-parchment-muted transition-colors
        focus-visible:outline-2 focus-visible:outline-brand-gold focus-visible:outline-offset-2
        ${className}`}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="w-1 h-1 rounded-full bg-current" />
      ))}
    </div>
  );
}
