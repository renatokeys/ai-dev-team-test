import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Card } from '../Card';
import type { Card as CardType } from '../../types';

function makeCard(overrides: Partial<CardType> = {}): CardType {
  return {
    id: 'card-1',
    title: 'Test Card',
    description: 'A test description',
    columnId: 'todo',
    position: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

const noop = () => {};
const mockCard = makeCard();

function renderCard(card: CardType = mockCard, onDelete: (cardId: string) => void = noop) {
  return render(
    <DndContext>
      <SortableContext items={[card.id]}>
        <Card card={card} onDelete={onDelete} />
      </SortableContext>
    </DndContext>,
  );
}

describe('Card', () => {
  let onDelete: (cardId: string) => void;
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    onDelete = vi.fn();
    confirmSpy = vi.spyOn(window, 'confirm');
  });

  it('renders the card title', () => {
    renderCard(mockCard, onDelete);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('renders the card description', () => {
    renderCard(mockCard, onDelete);
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('does not render description when empty', () => {
    const card = { ...mockCard, description: '' };
    renderCard(card, onDelete);
    expect(screen.queryByText('A test description')).not.toBeInTheDocument();
  });

  it('renders an article element with sortable role', () => {
    renderCard(mockCard, onDelete);
    const article = document.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveAttribute('aria-roledescription', 'sortable');
  });

  it('renders a time element', () => {
    renderCard(mockCard, onDelete);
    const time = screen.getByRole('time');
    expect(time).toHaveAttribute('dateTime', mockCard.createdAt);
  });

  it('renders delete button with accessible label', () => {
    renderCard(mockCard, onDelete);
    expect(screen.getByRole('button', { name: 'Delete Test Card' })).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);

    renderCard(mockCard, onDelete);
    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));

    expect(confirmSpy).toHaveBeenCalledWith('Delete "Test Card"?');
  });

  it('calls onDelete when user confirms deletion', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(true);
    const onDelete = vi.fn();
    const card = makeCard({ id: 'card-42' });

    renderCard(card, onDelete);
    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));

    expect(onDelete).toHaveBeenCalledWith('card-42');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not call onDelete when user cancels deletion', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);
    const onDelete = vi.fn();

    renderCard(mockCard, onDelete);
    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it('renders as drag overlay with reduced opacity', () => {
    render(<Card card={mockCard} onDelete={noop} isDragOverlay />);
    const article = screen.getByRole('article');
    expect(article.style.opacity).toBe('0.8');
  });
});
