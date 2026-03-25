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
    if (isOpen) {
      titleInputRef.current?.focus();
    }
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setTitle('');
    setDescription('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(columnId, trimmedTitle, description.trim());
    close();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
      >
        + Add Card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-2">
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        required
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
        rows={2}
        className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={close}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
