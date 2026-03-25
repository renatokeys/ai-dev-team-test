import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AddCardForm } from '../AddCardForm';

describe('AddCardForm', () => {
  const defaultProps = {
    columnId: 'todo' as const,
    onAdd: vi.fn(),
  };

  it('renders "+ Add Card" button by default', () => {
    render(<AddCardForm {...defaultProps} />);
    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
  });

  it('shows the inline form when button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...defaultProps} />);

    await user.click(screen.getByText('+ Add Card'));

    expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('auto-focuses the title input when form opens', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...defaultProps} />);

    await user.click(screen.getByText('+ Add Card'));

    expect(screen.getByPlaceholderText('Card title')).toHaveFocus();
  });

  it('calls onAdd with columnId, title, and description on submit', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="in-progress" onAdd={onAdd} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.type(screen.getByPlaceholderText('Card title'), 'My Task');
    await user.type(screen.getByPlaceholderText('Description (optional)'), 'Details');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('in-progress', 'My Task', 'Details');
  });

  it('trims whitespace from title and description', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="todo" onAdd={onAdd} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.type(screen.getByPlaceholderText('Card title'), '  Spaced  ');
    await user.type(screen.getByPlaceholderText('Description (optional)'), '  Desc  ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('todo', 'Spaced', 'Desc');
  });

  it('does not submit when title is empty', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="todo" onAdd={onAdd} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not submit when title is only whitespace', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="todo" onAdd={onAdd} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.type(screen.getByPlaceholderText('Card title'), '   ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('resets form and closes after successful submission', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="todo" onAdd={onAdd} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.type(screen.getByPlaceholderText('Card title'), 'Task');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Card title')).not.toBeInTheDocument();
  });

  it('closes the form when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCardForm columnId="todo" onAdd={onAdd} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.type(screen.getByPlaceholderText('Card title'), 'Draft');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
  });

  it('closes the form when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...defaultProps} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.keyboard('{Escape}');

    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Card title')).not.toBeInTheDocument();
  });

  it('resets field values after cancel', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...defaultProps} />);

    await user.click(screen.getByText('+ Add Card'));
    await user.type(screen.getByPlaceholderText('Card title'), 'Draft');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await user.click(screen.getByText('+ Add Card'));
    expect(screen.getByPlaceholderText('Card title')).toHaveValue('');
  });

  it('enforces maxLength on title input', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...defaultProps} />);

    await user.click(screen.getByText('+ Add Card'));
    const input = screen.getByPlaceholderText('Card title');
    expect(input).toHaveAttribute('maxLength', '100');
  });

  it('enforces maxLength on description textarea', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...defaultProps} />);

    await user.click(screen.getByText('+ Add Card'));
    const textarea = screen.getByPlaceholderText('Description (optional)');
    expect(textarea).toHaveAttribute('maxLength', '500');
  });
});
