import type { ColumnId } from '../types'

export interface ColumnDefinition {
  id: ColumnId;
  title: string;
  order: number;
}

export const COLUMNS: ColumnDefinition[] = [
  { id: 'backlog', title: 'Backlog', order: 0 },
  { id: 'todo', title: 'To Do', order: 1 },
  { id: 'in-progress', title: 'In Progress', order: 2 },
  { id: 'review', title: 'Review', order: 3 },
  { id: 'done', title: 'Done', order: 4 },
];
