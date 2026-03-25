import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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
  it('renders title, description, and creation date', () => {
    render(<Card card={makeCard()} onDelete={() => {}} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('renders relative date for older cards', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    render(<Card card={makeCard({ createdAt: twoHoursAgo })} onDelete={() => {}} />);

    expect(screen.getByText('2h ago')).toBeInTheDocument();
  });

  it('truncates long titles with ellipsis via truncate class', () => {
    render(<Card card={makeCard({ title: 'A'.repeat(200) })} onDelete={() => {}} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('truncate');
  });

  it('truncates long descriptions via line-clamp-2 class', () => {
    render(<Card card={makeCard({ description: 'B'.repeat(500) })} onDelete={() => {}} />);

    const description = screen.getByText('B'.repeat(500));
    expect(description).toHaveClass('line-clamp-2');
  });

  it('does not render description paragraph when description is empty', () => {
    render(<Card card={makeCard({ description: '' })} onDelete={() => {}} />);

    const paragraphs = screen.queryAllByRole('paragraph');
    expect(paragraphs).toHaveLength(0);
  });

  it('calls onDelete with card id when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<Card card={makeCard({ id: 'card-42' })} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /delete test card/i }));

    expect(onDelete).toHaveBeenCalledWith('card-42');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('delete button is keyboard accessible', () => {
    render(<Card card={makeCard()} onDelete={() => {}} />);

    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('uses semantic article element', () => {
    render(<Card card={makeCard()} onDelete={() => {}} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
