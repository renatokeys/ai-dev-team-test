import { useCallback } from 'react';
import type { BoardState, Card, ColumnId } from '../types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'trello-board';
const INITIAL_STATE: BoardState = { cards: [] };

export function useBoardState() {
  const [board, setBoard] = useLocalStorage<BoardState>(STORAGE_KEY, INITIAL_STATE);

  const addCard = useCallback(
    (columnId: ColumnId, title: string, description: string) => {
      setBoard((prev) => {
        const columnCards = prev.cards.filter((c) => c.columnId === columnId);
        const maxPosition = columnCards.reduce((max, c) => Math.max(max, c.position), -1);

        const card: Card = {
          id: crypto.randomUUID(),
          title,
          description,
          columnId,
          position: maxPosition + 1,
          createdAt: new Date().toISOString(),
        };

        return { cards: [...prev.cards, card] };
      });
    },
    [setBoard],
  );

  const deleteCard = useCallback(
    (cardId: string) => {
      setBoard((prev) => ({
        cards: prev.cards.filter((c) => c.id !== cardId),
      }));
    },
    [setBoard],
  );

  const moveCard = useCallback(
    (cardId: string, targetColumnId: ColumnId, targetPosition: number) => {
      setBoard((prev) => {
        const cardIndex = prev.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const card = prev.cards[cardIndex];
        const otherCards = prev.cards.filter((c) => c.id !== cardId);

        const targetColumnCards = otherCards
          .filter((c) => c.columnId === targetColumnId)
          .sort((a, b) => a.position - b.position);

        targetColumnCards.splice(targetPosition, 0, {
          ...card,
          columnId: targetColumnId,
          position: targetPosition,
        });

        const reindexed = targetColumnCards.map((c, i) => ({ ...c, position: i }));

        const remainingCards = otherCards.filter((c) => c.columnId !== targetColumnId);

        return { cards: [...remainingCards, ...reindexed] };
      });
    },
    [setBoard],
  );

  const getColumnCards = useCallback(
    (columnId: ColumnId): Card[] => {
      return board.cards
        .filter((c) => c.columnId === columnId)
        .sort((a, b) => a.position - b.position);
    },
    [board],
  );

  return { board, addCard, deleteCard, moveCard, getColumnCards };
}
