import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddCardForm } from '../AddCardForm';

describe('AddCardForm', () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('renders the "+ Add Card" button initially', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
  });

  it('shows the form when "+ Add Card" is clicked', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('auto-focuses the title input when form opens', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    expect(screen.getByPlaceholderText('Card title')).toHaveFocus();
  });

  it('calls onAdd with correct arguments on submit', () => {
    render(<AddCardForm columnId="in-progress" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    fireEvent.change(screen.getByPlaceholderText('Card title'), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description (optional)'), {
      target: { value: 'Task details' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(mockOnAdd).toHaveBeenCalledWith('in-progress', 'New Task', 'Task details');
  });

  it('does not submit when title is empty', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    fireEvent.click(screen.getByText('Add'));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not submit when title is only whitespace', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    fireEvent.change(screen.getByPlaceholderText('Card title'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('resets and closes the form after submission', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    fireEvent.change(screen.getByPlaceholderText('Card title'), {
      target: { value: 'Test' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Card title')).not.toBeInTheDocument();
  });

  it('closes the form when Cancel is clicked', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Card title')).not.toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('closes the form when Escape is pressed', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));
    fireEvent.keyDown(screen.getByPlaceholderText('Card title'), { key: 'Escape' });

    expect(screen.getByText('+ Add Card')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Card title')).not.toBeInTheDocument();
  });

  it('trims title and description before submitting', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    fireEvent.change(screen.getByPlaceholderText('Card title'), {
      target: { value: '  Trimmed Title  ' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description (optional)'), {
      target: { value: '  Trimmed Desc  ' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(mockOnAdd).toHaveBeenCalledWith('todo', 'Trimmed Title', 'Trimmed Desc');
  });

  it('enforces maxLength on title input', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    const titleInput = screen.getByPlaceholderText('Card title');
    expect(titleInput).toHaveAttribute('maxLength', '100');
  });

  it('enforces maxLength on description textarea', () => {
    render(<AddCardForm columnId="todo" onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByText('+ Add Card'));

    const descInput = screen.getByPlaceholderText('Description (optional)');
    expect(descInput).toHaveAttribute('maxLength', '500');
  });
});
