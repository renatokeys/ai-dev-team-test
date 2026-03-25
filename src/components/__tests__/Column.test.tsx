import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DndContext } from '@dnd-kit/core';
import { Column } from '../Column';
import type { Card } from '../../types';

const makeCard = (overrides: Partial<Card> = {}): Card => ({
  id: crypto.randomUUID(),
  title: 'Test card',
  description: '',
  columnId: 'backlog',
  position: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

function renderColumn(props: Partial<Parameters<typeof Column>[0]> = {}) {
  const defaultProps = {
    columnId: 'backlog' as const,
    title: 'Backlog',
    cards: [] as Card[],
    onDeleteCard: vi.fn(),
    ...props,
  };
  return render(
    <DndContext>
      <Column {...defaultProps} />
    </DndContext>,
  );
}

describe('Column', () => {
  it('renders the column title', () => {
    renderColumn({ title: 'Backlog' });
    expect(screen.getByText('Backlog')).toBeInTheDocument();
  });

  it('shows card count badge', () => {
    const cards = [makeCard({ id: '1' }), makeCard({ id: '2' })];
    renderColumn({ cards });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows zero count when empty', () => {
    renderColumn();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders empty state message when no cards', () => {
    renderColumn();
    expect(screen.getByText('No cards')).toBeInTheDocument();
  });

  it('renders card titles', () => {
    const cards = [
      makeCard({ id: '1', title: 'First task' }),
      makeCard({ id: '2', title: 'Second task' }),
    ];
    renderColumn({ cards });
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('has a scrollable card area', () => {
    renderColumn();
    const emptyMsg = screen.getByText('No cards');
    const scrollContainer = emptyMsg.parentElement!;
    expect(scrollContainer.className).toContain('overflow-y-auto');
  });

  it('highlights when isOver is true', () => {
    const { container } = renderColumn({ isOver: true });
    const columnEl = container.firstElementChild!;
    expect(columnEl.className).toContain('bg-blue-100');
    expect(columnEl.className).toContain('ring-2');
  });

  it('does not highlight when isOver is false', () => {
    const { container } = renderColumn({ isOver: false });
    const columnEl = container.firstElementChild!;
    expect(columnEl.className).not.toContain('bg-blue-100');
    expect(columnEl.className).toContain('bg-gray-100');
  });
});
