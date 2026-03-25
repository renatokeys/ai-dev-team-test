import type { Card as CardType } from '../types';
import { formatRelativeDate } from '../utils/formatRelativeDate';

interface CardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
}

export function Card({ card, onDelete }: CardProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${card.title}"?`)) {
      onDelete(card.id);
    }
  };

  return (
    <article className="relative group bg-white rounded shadow-sm p-3 hover:shadow-md transition-shadow">
      <button
        onClick={handleDelete}
        aria-label={`Delete ${card.title}`}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-sm leading-none"
      >
        ✕
      </button>
      <h3 className="text-sm font-medium text-gray-800 truncate pr-5">{card.title}</h3>
      {card.description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{card.description}</p>
      )}
      <time className="block mt-2 text-xs text-gray-400" dateTime={card.createdAt}>
        {formatRelativeDate(card.createdAt)}
      </time>
    </article>
  );
}
