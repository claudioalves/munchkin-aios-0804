import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { GamePlayerWithInfo, SortMode } from '@munchkin/shared';
import { PlayerCard } from '@/components/PlayerCard/PlayerCard';

interface PlayerGridProps {
  gamePlayers: GamePlayerWithInfo[];
  maxLevel: number;
  victoryLevel: number;
  sortMode: SortMode;
  isOwner?: boolean;
  onLevelChange: (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

interface SortableCardProps {
  gp: GamePlayerWithInfo;
  index: number;
  maxLevel: number;
  isLeader: boolean;
  isVictory: boolean;
  isOwner: boolean;
  onLevelChange: (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => void;
}

function SortableCard({ gp, index, maxLevel, isLeader, isVictory, isOwner, onLevelChange }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: gp.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        animationDelay: `${index * 60}ms`,
      }}
      className="animate-card-enter"
      {...attributes}
      {...listeners}
    >
      <PlayerCard
        gamePlayerId={gp.id}
        name={gp.player.name}
        color={gp.player.color}
        level={gp.level}
        maxLevel={maxLevel}
        isLeader={isLeader}
        isVictory={isVictory}
        isOwner={isOwner}
        onIncrement={(id) => onLevelChange(id, gp.level, 1)}
        onDecrement={(id) => onLevelChange(id, gp.level, -1)}
      />
    </div>
  );
}

export function PlayerGrid({
  gamePlayers,
  maxLevel,
  victoryLevel,
  sortMode,
  isOwner = true,
  onLevelChange,
  onReorder,
}: PlayerGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const maxLevelInGame = Math.max(...gamePlayers.map((p) => p.level), 0);
  const activePlayer = activeId ? gamePlayers.find((p) => p.id === activeId) : null;

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: isOwner ? 8 : 999999 },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id && onReorder) {
      onReorder(String(active.id), String(over.id));
    }
  };

  const grid = (
    <div
      className="grid gap-4 w-full"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
      }}
    >
      {gamePlayers.map((gp, index) => {
        const isVictory = gp.level >= victoryLevel;
        const isLeader = gp.level === maxLevelInGame && maxLevelInGame > 1 && !isVictory;

        if (sortMode === 'custom') {
          return (
            <SortableCard
              key={gp.id}
              gp={gp}
              index={index}
              maxLevel={maxLevel}
              isLeader={isLeader}
              isVictory={isVictory}
              isOwner={isOwner}
              onLevelChange={onLevelChange}
            />
          );
        }

        return (
          <div
            key={gp.id}
            className="animate-card-enter"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <PlayerCard
              gamePlayerId={gp.id}
              name={gp.player.name}
              color={gp.player.color}
              level={gp.level}
              maxLevel={maxLevel}
              isLeader={isLeader}
              isVictory={isVictory}
              isOwner={isOwner}
              onIncrement={(id) => onLevelChange(id, gp.level, 1)}
              onDecrement={(id) => onLevelChange(id, gp.level, -1)}
            />
          </div>
        );
      })}
    </div>
  );

  if (sortMode !== 'custom') return grid;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Movendo ${active.id}`,
          onDragOver: ({ over }) => over ? `Sobre ${over.id}` : undefined,
          onDragEnd: ({ active, over }) =>
            over ? `${active.id} movido para posição de ${over.id}` : `${active.id} retornado`,
          onDragCancel: ({ active }) => `Movimento de ${active.id} cancelado`,
        },
      }}
    >
      <SortableContext items={gamePlayers.map((p) => p.id)} strategy={rectSortingStrategy}>
        {grid}
      </SortableContext>

      <DragOverlay>
        {activePlayer && (
          <div style={{ opacity: 0.7 }}>
            <PlayerCard
              gamePlayerId={activePlayer.id}
              name={activePlayer.player.name}
              color={activePlayer.player.color}
              level={activePlayer.level}
              maxLevel={maxLevel}
              isLeader={false}
              isVictory={false}
              onIncrement={() => undefined}
              onDecrement={() => undefined}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
