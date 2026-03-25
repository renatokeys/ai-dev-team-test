import type { Card as CardType } from '../types';

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface CardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
}

export function Card({ card, onDelete }: CardProps) {
  return (
    <article className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3">
      <button
        onClick={() => onDelete(card.id)}
        aria-label={`Delete ${card.title}`}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
      <h3 className="font-bold text-sm text-gray-900 truncate pr-6">{card.title}</h3>
      {card.description && (
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{card.description}</p>
      )}
      <time dateTime={card.createdAt} className="mt-2 block text-xs text-gray-400">
        {formatRelativeDate(card.createdAt)}
      </time>
    </article>
  );
}
