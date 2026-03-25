export type ColumnId = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  position: number;
  createdAt: string;
}

export interface BoardState {
  cards: Card[];
}
