import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardState } from '../useBoardState';

describe('useBoardState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty board', () => {
    const { result } = renderHook(() => useBoardState());
    expect(result.current.board.cards).toEqual([]);
  });

  describe('addCard', () => {
    it('adds a card to the specified column', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'Test Card', 'A description');
      });

      const cards = result.current.getColumnCards('todo');
      expect(cards).toHaveLength(1);
      expect(cards[0].title).toBe('Test Card');
      expect(cards[0].description).toBe('A description');
      expect(cards[0].columnId).toBe('todo');
      expect(cards[0].position).toBe(0);
      expect(cards[0].id).toBeDefined();
      expect(cards[0].createdAt).toBeDefined();
    });

    it('assigns incrementing positions within the same column', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'First', '');
      });
      act(() => {
        result.current.addCard('todo', 'Second', '');
      });

      const cards = result.current.getColumnCards('todo');
      expect(cards).toHaveLength(2);
      expect(cards[0].position).toBe(0);
      expect(cards[1].position).toBe(1);
    });

    it('does not affect cards in other columns', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'Todo Card', '');
      });
      act(() => {
        result.current.addCard('backlog', 'Backlog Card', '');
      });

      expect(result.current.getColumnCards('todo')).toHaveLength(1);
      expect(result.current.getColumnCards('backlog')).toHaveLength(1);
    });
  });

  describe('deleteCard', () => {
    it('removes the specified card', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'To Delete', '');
      });

      const cardId = result.current.getColumnCards('todo')[0].id;

      act(() => {
        result.current.deleteCard(cardId);
      });

      expect(result.current.getColumnCards('todo')).toHaveLength(0);
      expect(result.current.board.cards).toHaveLength(0);
    });

    it('does not remove other cards', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'Keep', '');
      });
      act(() => {
        result.current.addCard('todo', 'Delete', '');
      });

      const deleteId = result.current.getColumnCards('todo')[1].id;

      act(() => {
        result.current.deleteCard(deleteId);
      });

      const remaining = result.current.getColumnCards('todo');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].title).toBe('Keep');
    });
  });

  describe('moveCard', () => {
    it('moves a card to a different column', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'Moving Card', '');
      });

      const cardId = result.current.getColumnCards('todo')[0].id;

      act(() => {
        result.current.moveCard(cardId, 'in-progress', 0);
      });

      expect(result.current.getColumnCards('todo')).toHaveLength(0);
      const movedCards = result.current.getColumnCards('in-progress');
      expect(movedCards).toHaveLength(1);
      expect(movedCards[0].title).toBe('Moving Card');
      expect(movedCards[0].columnId).toBe('in-progress');
    });

    it('inserts at the correct position', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('done', 'First', '');
      });
      act(() => {
        result.current.addCard('done', 'Second', '');
      });
      act(() => {
        result.current.addCard('todo', 'Insert Me', '');
      });

      const cardId = result.current.getColumnCards('todo')[0].id;

      act(() => {
        result.current.moveCard(cardId, 'done', 1);
      });

      const doneCards = result.current.getColumnCards('done');
      expect(doneCards).toHaveLength(3);
      expect(doneCards[0].title).toBe('First');
      expect(doneCards[1].title).toBe('Insert Me');
      expect(doneCards[2].title).toBe('Second');
    });

    it('reindexes positions after move', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('done', 'A', '');
      });
      act(() => {
        result.current.addCard('done', 'B', '');
      });
      act(() => {
        result.current.addCard('todo', 'C', '');
      });

      const cardId = result.current.getColumnCards('todo')[0].id;

      act(() => {
        result.current.moveCard(cardId, 'done', 0);
      });

      const doneCards = result.current.getColumnCards('done');
      expect(doneCards.map((c) => c.position)).toEqual([0, 1, 2]);
    });
  });

  describe('getColumnCards', () => {
    it('returns cards sorted by position', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'First', '');
      });
      act(() => {
        result.current.addCard('todo', 'Second', '');
      });
      act(() => {
        result.current.addCard('todo', 'Third', '');
      });

      const cards = result.current.getColumnCards('todo');
      expect(cards.map((c) => c.title)).toEqual(['First', 'Second', 'Third']);
    });

    it('returns empty array for column with no cards', () => {
      const { result } = renderHook(() => useBoardState());
      expect(result.current.getColumnCards('review')).toEqual([]);
    });
  });

  describe('persistence', () => {
    it('persists state to localStorage', () => {
      const { result } = renderHook(() => useBoardState());

      act(() => {
        result.current.addCard('todo', 'Persisted', '');
      });

      const stored = JSON.parse(localStorage.getItem('trello-board')!);
      expect(stored.cards).toHaveLength(1);
      expect(stored.cards[0].title).toBe('Persisted');
    });

    it('restores state from localStorage', () => {
      const { result: first } = renderHook(() => useBoardState());

      act(() => {
        first.current.addCard('todo', 'Restored', '');
      });

      const { result: second } = renderHook(() => useBoardState());
      const cards = second.current.getColumnCards('todo');
      expect(cards).toHaveLength(1);
      expect(cards[0].title).toBe('Restored');
    });
  });
});
