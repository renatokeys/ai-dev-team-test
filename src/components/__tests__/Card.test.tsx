import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../Card';
import type { Card as CardType } from '../../types';

const makeCard = (overrides: Partial<CardType> = {}): CardType => ({
  id: 'card-1',
  title: 'Test Card',
  description: 'A test description',
  columnId: 'todo',
  position: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('Card', () => {
  it('renders title, description, and creation date', () => {
    render(<Card card={makeCard()} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('renders as an article element', () => {
    render(<Card card={makeCard()} onDelete={vi.fn()} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders delete button with accessible label', () => {
    render(<Card card={makeCard({ title: 'My Task' })} onDelete={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Delete My Task' })).toBeInTheDocument();
  });

  it('calls onDelete with card id when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Card card={makeCard({ id: 'abc-123' })} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Delete Test Card' }));
    expect(onDelete).toHaveBeenCalledWith('abc-123');
  });

  it('truncates long titles with ellipsis via CSS class', () => {
    render(<Card card={makeCard()} onDelete={vi.fn()} />);
    const title = screen.getByText('Test Card');
    expect(title.className).toContain('truncate');
  });

  it('truncates long descriptions to 2 lines via CSS class', () => {
    render(<Card card={makeCard()} onDelete={vi.fn()} />);
    const desc = screen.getByText('A test description');
    expect(desc.className).toContain('line-clamp-2');
  });

  it('does not render description paragraph when description is empty', () => {
    render(<Card card={makeCard({ description: '' })} onDelete={vi.fn()} />);
    expect(screen.queryByText('A test description')).not.toBeInTheDocument();
    const article = screen.getByRole('article');
    expect(article.querySelectorAll('p')).toHaveLength(0);
  });

  it('renders a time element with datetime attribute', () => {
    const createdAt = '2026-01-15T12:00:00Z';
    render(<Card card={makeCard({ createdAt })} onDelete={vi.fn()} />);
    const timeEl = screen.getByText(/ago|just now|2026/);
    expect(timeEl.tagName).toBe('TIME');
    expect(timeEl).toHaveAttribute('datetime', createdAt);
  });
});
