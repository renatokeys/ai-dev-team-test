import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Card as CardType } from '../types';
import type { ColumnId } from '../types';
import { Card } from './Card';

interface ColumnProps {
  columnId: ColumnId;
  title: string;
  cards: CardType[];
  onDeleteCard: (cardId: string) => void;
  isOver?: boolean;
}

export function Column({ columnId, title, cards, onDeleteCard, isOver }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div className={`flex flex-col flex-1 min-w-0 rounded-lg transition-colors ${isOver ? 'bg-blue-100 ring-2 ring-blue-300' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 truncate">{title}</h2>
        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
          {cards.length}
        </span>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[60px]">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No cards</p>
          ) : (
            cards.map((card) => (
              <Card key={card.id} card={card} onDelete={onDeleteCard} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
