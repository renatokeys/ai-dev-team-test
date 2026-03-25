import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { COLUMNS } from '../constants/columns';
import type { Card as CardType, ColumnId } from '../types';
import { Column } from './Column';
import { Card } from './Card';

interface BoardProps {
  getColumnCards: (columnId: ColumnId) => CardType[];
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, targetColumnId: ColumnId, targetPosition: number) => void;
}

export function Board({ getColumnCards, onDeleteCard, onMoveCard }: BoardProps) {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [overColumnId, setOverColumnId] = useState<ColumnId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const findColumnForCard = useCallback(
    (cardId: string): ColumnId | null => {
      for (const col of COLUMNS) {
        const cards = getColumnCards(col.id);
        if (cards.some((c) => c.id === cardId)) return col.id;
      }
      return null;
    },
    [getColumnCards],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const cardId = active.id as string;
      const columnId = findColumnForCard(cardId);
      if (!columnId) return;
      const cards = getColumnCards(columnId);
      const card = cards.find((c) => c.id === cardId);
      if (card) setActiveCard(card);
    },
    [findColumnForCard, getColumnCards],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (!over) {
        setOverColumnId(null);
        return;
      }

      const overId = over.id as string;
      const isColumn = COLUMNS.some((c) => c.id === overId);
      if (isColumn) {
        setOverColumnId(overId as ColumnId);
      } else {
        const col = findColumnForCard(overId);
        setOverColumnId(col);
      }
    },
    [findColumnForCard],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCard(null);
      setOverColumnId(null);

      if (!over) return;

      const cardId = active.id as string;
      const overId = over.id as string;

      const isColumn = COLUMNS.some((c) => c.id === overId);

      if (isColumn) {
        const targetColumnId = overId as ColumnId;
        const targetCards = getColumnCards(targetColumnId);
        onMoveCard(cardId, targetColumnId, targetCards.length);
      } else {
        const targetColumnId = findColumnForCard(overId);
        if (!targetColumnId) return;
        const targetCards = getColumnCards(targetColumnId);
        const overIndex = targetCards.findIndex((c) => c.id === overId);
        onMoveCard(cardId, targetColumnId, overIndex >= 0 ? overIndex : targetCards.length);
      }
    },
    [getColumnCards, onMoveCard, findColumnForCard],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full p-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            columnId={col.id}
            title={col.title}
            cards={getColumnCards(col.id)}
            onDeleteCard={onDeleteCard}
            isOver={overColumnId === col.id}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <Card card={activeCard} onDelete={() => {}} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
