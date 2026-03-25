import { COLUMNS } from '../constants/columns';
import type { Card } from '../types';
import type { ColumnId } from '../types';
import { Column } from './Column';

interface BoardProps {
  getColumnCards: (columnId: ColumnId) => Card[];
  onDeleteCard: (cardId: string) => void;
}

export function Board({ getColumnCards, onDeleteCard }: BoardProps) {
  return (
    <div className="flex gap-4 h-full p-4">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          title={col.title}
          cards={getColumnCards(col.id)}
          onDeleteCard={onDeleteCard}
        />
      ))}
    </div>
  );
}
