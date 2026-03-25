import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('Card', () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    confirmSpy = vi.spyOn(window, 'confirm');
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('renders title, description, and creation date', () => {
    const card = makeCard();
    render(<Card card={card} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('renders relative date for older cards', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const card = makeCard({ createdAt: twoHoursAgo });
    render(<Card card={card} onDelete={vi.fn()} />);

    expect(screen.getByText('2h ago')).toBeInTheDocument();
  });

  it('renders relative date in days', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const card = makeCard({ createdAt: threeDaysAgo });
    render(<Card card={card} onDelete={vi.fn()} />);

    expect(screen.getByText('3d ago')).toBeInTheDocument();
  });

  it('does not render description paragraph when description is empty', () => {
    const card = makeCard({ description: '' });
    render(<Card card={card} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('shows confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);
    const card = makeCard();
    render(<Card card={card} onDelete={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /delete test card/i }));

    expect(confirmSpy).toHaveBeenCalledWith('Delete "Test Card"?');
  });

  it('calls onDelete when user confirms deletion', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(true);
    const onDelete = vi.fn();
    const card = makeCard({ id: 'card-42' });
    render(<Card card={card} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /delete test card/i }));

    expect(onDelete).toHaveBeenCalledWith('card-42');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not call onDelete when user cancels deletion', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);
    const onDelete = vi.fn();
    const card = makeCard();
    render(<Card card={card} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /delete test card/i }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it('has accessible delete button with descriptive label', () => {
    const card = makeCard({ title: 'My Task' });
    render(<Card card={card} onDelete={vi.fn()} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete My Task' });
    expect(deleteButton).toBeInTheDocument();
  });

  it('renders as an article element for semantic HTML', () => {
    const card = makeCard();
    render(<Card card={card} onDelete={vi.fn()} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders title in a heading element', () => {
    const card = makeCard({ title: 'Important Task' });
    render(<Card card={card} onDelete={vi.fn()} />);

    const heading = screen.getByRole('heading', { name: 'Important Task' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('truncates long titles with ellipsis via CSS class', () => {
    const card = makeCard({ title: 'A very long title that should be truncated' });
    render(<Card card={card} onDelete={vi.fn()} />);

    const heading = screen.getByRole('heading');
    expect(heading.className).toContain('truncate');
  });

  it('truncates long descriptions to 2 lines via CSS class', () => {
    const card = makeCard({ description: 'A long description that goes on and on' });
    render(<Card card={card} onDelete={vi.fn()} />);

    const description = screen.getByText(card.description);
    expect(description.className).toContain('line-clamp-2');
  });

  it('has white background and shadow classes', () => {
    const card = makeCard();
    render(<Card card={card} onDelete={vi.fn()} />);

    const article = screen.getByRole('article');
    expect(article.className).toContain('bg-white');
    expect(article.className).toContain('rounded-lg');
    expect(article.className).toContain('shadow-sm');
  });

  it('has hover shadow transition class', () => {
    const card = makeCard();
    render(<Card card={card} onDelete={vi.fn()} />);

    const article = screen.getByRole('article');
    expect(article.className).toContain('hover:shadow-md');
  });

  it('has time element with datetime attribute', () => {
    const createdAt = '2026-03-20T10:00:00.000Z';
    const card = makeCard({ createdAt });
    render(<Card card={card} onDelete={vi.fn()} />);

    const timeEl = screen.getByText(/ago|just now/i).closest('time');
    expect(timeEl).toHaveAttribute('datetime', createdAt);
  });
});
