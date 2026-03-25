import type { Card as CardType } from '../types';
import { Card } from './Card';

interface ColumnProps {
  title: string;
  cards: CardType[];
  onDeleteCard: (cardId: string) => void;
}

export function Column({ title, cards, onDeleteCard }: ColumnProps) {
  return (
    <div className="flex flex-col flex-1 min-w-0 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 truncate">{title}</h2>
        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
          {cards.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {cards.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No cards</p>
        ) : (
          cards.map((card) => (
            <Card key={card.id} card={card} onDelete={onDeleteCard} />
          ))
        )}
      </div>
    </div>
  );
}
