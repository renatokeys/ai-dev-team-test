import { COLUMNS } from '../constants/columns';
import type { Card } from '../types';
import type { ColumnId } from '../types';
import { Column } from './Column';

interface BoardProps {
  getColumnCards: (columnId: ColumnId) => Card[];
}

export function Board({ getColumnCards }: BoardProps) {
  return (
    <div className="flex gap-4 h-full p-4">
      {COLUMNS.map((col) => (
        <Column key={col.id} title={col.title} cards={getColumnCards(col.id)} />
      ))}
    </div>
  );
}
