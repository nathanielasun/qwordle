/**
 * MultiGameView - Grid layout for displaying multiple Wordle games
 */

import { GameCard } from './GameCard';
import { Keyboard } from '../Keyboard';
import { QuantumPanel } from '../QuantumPanel';
import { useKeyboard } from '../../hooks';
import { useGameStore } from '../../store';
import { useEffect, useState, useMemo } from 'react';
import { loadWordList, isWordListLoaded } from '../../utils/wordValidation';

interface MultiGameViewProps {
  onReset: () => void;
}

export function MultiGameView({ onReset }: MultiGameViewProps) {
  const [isLoading, setIsLoading] = useState(!isWordListLoaded());
  const [isShaking, setIsShaking] = useState(false);

  const {
    n,
    games,
    currentGuess,
    errorMessage,
    phase,
    keyStates,
    recentBonusGame,
    stats,
    setCurrentGuess,
    submitGuess,
    clearError,
    resetGame,
    addBonusToGame,
  } = useGameStore();

  // Generate binary labels for each game (e.g., ['00', '01', '10', '11'] for n=2)
  const gameLabels = useMemo(() => {
    return games.map((_, i) => i.toString(2).padStart(n, '0'));
  }, [games, n]);

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

  // Handle keyboard input
  const handleKeyPress = (key: string) => {
    if (phase !== 'playing') return;
    if (currentGuess.length >= 5) return;
    setCurrentGuess(currentGuess + key);
    clearError();
  };

  const handleBackspace = () => {
    if (phase !== 'playing') return;
    setCurrentGuess(currentGuess.slice(0, -1));
    clearError();
  };

  const handleEnter = () => {
    if (phase !== 'playing') return;
    submitGuess();
  };

  // Trigger shake on error
  useEffect(() => {
    if (errorMessage) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Physical keyboard support
  useKeyboard({
    onKeyPress: handleKeyPress,
    onEnter: handleEnter,
    onBackspace: handleBackspace,
    disabled: phase !== 'playing' || isLoading,
  });

  // Calculate grid columns based on number of games
  const numGames = games.length;
  const getGridCols = () => {
    if (numGames <= 2) return 2;
    if (numGames <= 4) return 2;
    if (numGames <= 8) return 4;
    if (numGames <= 16) return 4;
    return 8; // For 32 games
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="animate-spin w-8 h-8 border-2 border-quantum-primary border-t-transparent rounded-full" />
        <p className="text-text-muted">Loading words...</p>
      </div>
    );
  }

  const activeGames = games.filter(g => g.status === 'playing').length;
  const wonGames = games.filter(g => g.status === 'won').length;
  const lostGames = games.filter(g => g.status === 'lost').length;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-4">
      {/* Game finished message */}
      {phase === 'finished' && (
        <div className={`text-center p-4 rounded-lg ${
          wonGames === numGames ? 'bg-wordle-correct bg-opacity-20' :
          lostGames === numGames ? 'bg-red-600 bg-opacity-20' :
          'bg-quantum-primary bg-opacity-20'
        }`}>
          <p className="text-2xl font-bold mb-2">
            {wonGames === numGames ? '🎉 Perfect!' :
             lostGames === numGames ? 'Game Over' :
             'Game Complete!'}
          </p>
          <p className="text-text-muted mb-1">
            Won: {wonGames}/{numGames} games
          </p>
          <p className="text-text-muted mb-4">
            Total guesses used: {stats.totalGuesses}
            {stats.bonusGuessesUsed > 0 && ` (${stats.bonusGuessesUsed} bonus)`}
          </p>
          <div className="flex gap-2 justify-center">
            <button onClick={resetGame} className="btn btn--primary">
              Play Again
            </button>
            <button onClick={onReset} className="btn btn--secondary">
              Change Settings
            </button>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Playing:</span>
          <span className="font-bold text-quantum-primary">{activeGames}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Won:</span>
          <span className="font-bold text-status-won">{wonGames}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Lost:</span>
          <span className="font-bold text-status-lost">{lostGames}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Guesses:</span>
          <span className="font-bold">{stats.totalGuesses}</span>
        </div>
      </div>

      {/* Quantum Circuit Panel */}
      {phase === 'playing' && (
        <QuantumPanel
          numQubits={n}
          onBonusGranted={addBonusToGame}
          gameLabels={gameLabels}
          disabled={phase !== 'playing'}
        />
      )}

      {/* Error message */}
      {errorMessage && phase === 'playing' && (
        <div className="text-center text-red-400 text-sm font-medium animate-shake">
          {errorMessage}
        </div>
      )}

      {/* Current input display */}
      {phase === 'playing' && (
        <div className="text-center">
          <div className="inline-flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center border-2 text-xl font-bold uppercase ${
                  currentGuess[i]
                    ? 'border-gray-400 bg-bg-secondary'
                    : 'border-wordle-border'
                } ${isShaking && currentGuess.length === 5 ? 'animate-shake' : ''}`}
              >
                {currentGuess[i] || ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game grid */}
      <div
        className="grid gap-3 overflow-y-auto max-h-[50vh]"
        style={{
          gridTemplateColumns: `repeat(${getGridCols()}, minmax(0, 1fr))`,
        }}
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            currentInput={currentGuess}
            isActive={phase === 'playing' && game.status === 'playing'}
            hasBonus={recentBonusGame === game.id}
          />
        ))}
      </div>

      {/* Keyboard */}
      <div className="mt-2">
        <Keyboard
          keyStates={keyStates}
          onKeyPress={handleKeyPress}
          onEnter={handleEnter}
          onBackspace={handleBackspace}
          disabled={phase !== 'playing'}
        />
      </div>
    </div>
  );
}
