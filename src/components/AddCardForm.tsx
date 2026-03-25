import { useState, useRef, useEffect } from 'react';
import type { ColumnId } from '../types';

interface AddCardFormProps {
  columnId: ColumnId;
  onAdd: (columnId: ColumnId, title: string, description: string) => void;
}

export function AddCardForm({ columnId, onAdd }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  function reset() {
    setTitle('');
    setDescription('');
    setIsOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(columnId, trimmedTitle, description.trim());
    reset();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      reset();
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full mt-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors text-left"
      >
        + Add Card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="mt-2 p-2 bg-white rounded shadow-sm border border-gray-200">
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        required
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
        rows={2}
        className="w-full mt-2 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
