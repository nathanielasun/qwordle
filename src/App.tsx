import { useState, useEffect } from 'react';
import { MultiGameView } from './components/MultiGameView';
import { useGameStore } from './store';
import { loadWordList, isWordListLoaded } from './utils/wordValidation';
import { calculateGuesses } from './constants/config';

function App() {
  const { phase, n, initializeGames, resetGame } = useGameStore();
  const [isLoading, setIsLoading] = useState(!isWordListLoaded());

  // Load word list on mount
  useEffect(() => {
    if (!isWordListLoaded()) {
      loadWordList()
        .then(() => setIsLoading(false))
        .catch((err) => {
          console.error('Failed to load words:', err);
          setIsLoading(false);
        });
    }
  }, []);

  const handleStartGame = (numQubits: number) => {
    initializeGames(numQubits);
  };

  const handleBackToSetup = () => {
    resetGame();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-quantum-primary border-t-transparent rounded-full" />
          <p className="text-text-muted">Loading QWordle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-wordle-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-quantum-primary">Q</span>Wordle
          </h1>
          {phase !== 'setup' && (
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span>n = {n}</span>
              <span>{Math.pow(2, n)} games</span>
              <span>{calculateGuesses(n)} guesses each</span>
              <button
                onClick={handleBackToSetup}
                className="btn btn--secondary text-xs"
              >
                New Game
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {phase === 'setup' && (
          <GameSetup onStartGame={handleStartGame} />
        )}
        {(phase === 'playing' || phase === 'finished') && (
          <MultiGameView onReset={handleBackToSetup} />
        )}
      </main>
    </div>
  );
}

interface GameSetupProps {
  onStartGame: (n: number) => void;
}

function GameSetup({ onStartGame }: GameSetupProps) {
  const [selectedN, setSelectedN] = useState(2);

  return (
    <div className="max-w-lg w-full text-center">
      <h2 className="text-4xl font-bold mb-2">
        <span className="text-quantum-primary">Q</span>Wordle
      </h2>
      <p className="text-text-muted mb-8">
        Quantum-Enhanced Parallel Wordle
      </p>

      <div className="mb-8">
        <p className="text-sm text-text-muted mb-4">
          Select number of qubits (n):
        </p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setSelectedN(n)}
              className={`
                flex flex-col items-center p-4 rounded-lg border-2 transition-all
                ${selectedN === n
                  ? 'border-quantum-primary bg-quantum-primary bg-opacity-10'
                  : 'border-wordle-border hover:border-gray-500'
                }
              `}
            >
              <span className="text-2xl font-bold">{n}</span>
              <span className="text-xs text-text-muted mt-1">
                {Math.pow(2, n)} games
              </span>
              <span className="text-xs text-text-muted">
                {calculateGuesses(n)} guesses
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStartGame(selectedN)}
        className="btn btn--primary text-lg px-8 py-3"
      >
        Start Game
      </button>

      <div className="mt-8 text-left bg-bg-secondary rounded-lg p-4 text-sm">
        <h3 className="font-bold mb-2">How It Works</h3>
        <ul className="list-disc list-inside space-y-1 text-text-muted">
          <li>Play 2<sup>n</sup> Wordle games simultaneously</li>
          <li>Each guess applies to ALL active games</li>
          <li>Build quantum circuits to earn bonus guesses (Phase 3)</li>
          <li>Measure the circuit to collapse to a single game</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
