import type { Card as CardType } from '../types';

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const created = new Date(dateString).getTime();
  const diffMs = now - created;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

interface CardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
}

export function Card({ card, onDelete }: CardProps) {
  return (
    <article className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3">
      <button
        type="button"
        onClick={() => onDelete(card.id)}
        aria-label={`Delete ${card.title}`}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-0.5 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <h3 className="font-bold text-sm text-gray-900 truncate pr-6">{card.title}</h3>

      {card.description && (
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{card.description}</p>
      )}

      <time className="block text-xs text-gray-400 mt-2" dateTime={card.createdAt}>
        {getRelativeTime(card.createdAt)}
      </time>
    </article>
  );
}
