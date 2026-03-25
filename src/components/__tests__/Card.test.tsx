import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Card } from '../Card';
import type { Card as CardType } from '../../types';

const mockCard: CardType = {
  id: 'card-1',
  title: 'Test Card',
  description: 'A test description',
  columnId: 'todo',
  position: 0,
  createdAt: new Date().toISOString(),
};

describe('Card', () => {
  let onDelete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onDelete = vi.fn();
    vi.restoreAllMocks();
  });

  it('renders the card title', () => {
    render(<Card card={mockCard} onDelete={onDelete} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('renders the card description', () => {
    render(<Card card={mockCard} onDelete={onDelete} />);
    expect(screen.getByText('A test description')).toBeInTheDocument();
  });

  it('does not render description when empty', () => {
    const card = { ...mockCard, description: '' };
    render(<Card card={card} onDelete={onDelete} />);
    expect(screen.queryByText('A test description')).not.toBeInTheDocument();
  });

  it('renders an article element', () => {
    render(<Card card={mockCard} onDelete={onDelete} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders a time element', () => {
    render(<Card card={mockCard} onDelete={onDelete} />);
    const time = screen.getByRole('time');
    expect(time).toHaveAttribute('dateTime', mockCard.createdAt);
  });

  it('renders delete button with accessible label', () => {
    render(<Card card={mockCard} onDelete={onDelete} />);
    expect(screen.getByRole('button', { name: 'Delete Test Card' })).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<Card card={mockCard} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));

    expect(confirmSpy).toHaveBeenCalledWith('Delete "Test Card"?');
  });

  it('calls onDelete when confirmation is accepted', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<Card card={mockCard} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));

    expect(onDelete).toHaveBeenCalledWith('card-1');
  });

  it('does not call onDelete when confirmation is canceled', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<Card card={mockCard} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));

    expect(onDelete).not.toHaveBeenCalled();
  });
});
