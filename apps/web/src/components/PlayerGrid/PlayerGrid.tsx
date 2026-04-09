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
import { SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { GamePlayerWithInfo, SortMode } from '@munchkin/shared';
import { PlayerCard } from '@/components/PlayerCard/PlayerCard';
import { LevelButton } from '@/components/LevelButton/LevelButton';

interface PlayerGridProps {
  gamePlayers: GamePlayerWithInfo[];
  maxLevel: number;
  victoryLevel: number;
  sortMode: SortMode;
  isOwner?: boolean;
  onLevelChange: (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => void;
  onReorder?: (activeId: string, overId: string) => void;
  viewMode?: 'grid' | 'list';
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

interface SortableListItemProps {
  gp: GamePlayerWithInfo;
  index: number;
  maxLevel: number;
  victoryLevel: number;
  isLeader: boolean;
  isVictory: boolean;
  isOwner: boolean;
  onLevelChange: (gamePlayerId: string, currentLevel: number, delta: 1 | -1) => void;
}

function ListItem({ gp, index, maxLevel, victoryLevel, isLeader, isVictory, isOwner, onLevelChange }: SortableListItemProps) {
  const ringClass = isVictory
    ? 'ring-2 ring-brand-emerald'
    : isLeader
    ? 'ring-2 ring-brand-gold'
    : '';

  return (
    <div
      className={`flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 animate-card-enter ${ringClass}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: gp.player.color }}
      />
      <span className="font-heading text-parchment text-sm flex-shrink-0 w-24 truncate">
        {gp.player.name}
      </span>
      <div className="flex-1 h-2 bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            backgroundColor: gp.player.color,
            width: `${(gp.level / maxLevel) * 100}%`,
          }}
        />
      </div>
      <span
        className="font-display text-2xl font-black w-8 text-right"
        style={{ color: gp.player.color }}
      >
        {gp.level}
      </span>
      {isOwner && !isVictory && (
        <>
          <LevelButton
            variant="decrement"
            disabled={gp.level <= 1}
            onClick={() => onLevelChange(gp.id, gp.level, -1)}
            aria-label={`Diminuir nível de ${gp.player.name}`}
          />
          <LevelButton
            variant="increment"
            disabled={gp.level >= victoryLevel}
            onClick={() => onLevelChange(gp.id, gp.level, 1)}
            aria-label={`Aumentar nível de ${gp.player.name}`}
          />
        </>
      )}
    </div>
  );
}

function SortableListItem(props: SortableListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.gp.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <ListItem {...props} />
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
  viewMode = 'grid',
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

  if (viewMode === 'list') {
    const list = (
      <div className="flex flex-col gap-2 w-full">
        {gamePlayers.map((gp, index) => {
          const isVictory = gp.level >= victoryLevel;
          const isLeader = gp.level === maxLevelInGame && maxLevelInGame > 1 && !isVictory;

          if (sortMode === 'custom') {
            return (
              <SortableListItem
                key={gp.id}
                gp={gp}
                index={index}
                maxLevel={maxLevel}
                victoryLevel={victoryLevel}
                isLeader={isLeader}
                isVictory={isVictory}
                isOwner={isOwner}
                onLevelChange={onLevelChange}
              />
            );
          }

          return (
            <ListItem
              key={gp.id}
              gp={gp}
              index={index}
              maxLevel={maxLevel}
              victoryLevel={victoryLevel}
              isLeader={isLeader}
              isVictory={isVictory}
              isOwner={isOwner}
              onLevelChange={onLevelChange}
            />
          );
        })}
      </div>
    );

    if (sortMode !== 'custom') return list;

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
        <SortableContext items={gamePlayers.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {list}
        </SortableContext>

        <DragOverlay>
          {activePlayer && (
            <div style={{ opacity: 0.7 }}>
              <ListItem
                gp={activePlayer}
                index={0}
                maxLevel={maxLevel}
                victoryLevel={victoryLevel}
                isLeader={false}
                isVictory={false}
                isOwner={false}
                onLevelChange={() => undefined}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    );
  }

  // Grid mode (default)
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
