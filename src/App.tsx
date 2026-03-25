import { Board } from './components/Board';
import { useBoardState } from './hooks/useBoardState';

function App() {
  const { getColumnCards, addCard, deleteCard, moveCard } = useBoardState();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">
          Trello-Style TODO Board
        </h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Board getColumnCards={getColumnCards} onAddCard={addCard} onDeleteCard={deleteCard} onMoveCard={moveCard} />
      </main>
    </div>
  );
}

export default App;
