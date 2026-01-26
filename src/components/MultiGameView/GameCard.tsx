/**
 * GameCard - Compact display of a single game within the multi-game view
 */

import { useEffect, useState, useRef } from 'react';
import { WordleRow } from '../WordleGrid';
import { SingleGame } from '../../types';

interface GameCardProps {
  game: SingleGame;
  currentInput: string;
  isActive: boolean;
  hasBonus?: boolean;
}

// Track previous input length to detect new letters
function usePreviousInputLength(value: string) {
  const ref = useRef(0);
  useEffect(() => {
    ref.current = value.length;
  }, [value]);
  return ref.current;
}

export function GameCard({
  game,
  currentInput,
  isActive,
  hasBonus = false,
}: GameCardProps) {
  const { id, binaryLabel, guesses, maxGuesses, bonusGuesses, status, targetWord } = game;
  const totalGuesses = maxGuesses + bonusGuesses;
  const remainingGuesses = totalGuesses - guesses.length;

  // Track the revealing row for animations
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const previousGuessCount = useRef(guesses.length);
  const previousInputLength = usePreviousInputLength(currentInput);

  // When a new guess is added, trigger reveal animation
  useEffect(() => {
    if (guesses.length > previousGuessCount.current) {
      const newRow = guesses.length - 1;
      setRevealingRow(newRow);
      // Clear revealing state after animation completes
      const timer = setTimeout(() => setRevealingRow(null), 1500);
      previousGuessCount.current = guesses.length;
      return () => clearTimeout(timer);
    }
  }, [guesses.length]);

  // Determine if this game just won (for win animation)
  const justWon = status === 'won' && revealingRow === guesses.length - 1;

  // Determine card styling based on status
  const statusClass =
    status === 'won' ? 'game-card--won' :
    status === 'lost' ? 'game-card--lost' : '';

  const bonusClass = hasBonus ? 'game-card--bonus' : '';

  // Generate ARIA label for the game card
  const getCardAriaLabel = () => {
    const stateLabel = `Quantum state ${binaryLabel}`;
    const statusLabel =
      status === 'won' ? 'Won' :
      status === 'lost' ? `Lost, answer was ${targetWord}` :
      `${remainingGuesses} guesses remaining`;
    return `${stateLabel}, Game ${id}, ${statusLabel}`;
  };

  return (
    <div
      className={`game-card ${statusClass} ${bonusClass} flex flex-col`}
      role="region"
      aria-label={getCardAriaLabel()}
    >
      {/* Header with quantum state label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-quantum-primary font-mono text-xs">
            |{binaryLabel}⟩
          </span>
          <span className="text-text-muted text-xs">
            #{id}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {bonusGuesses > 0 && (
            <span className="text-status-bonus text-xs font-bold">
              +{bonusGuesses}
            </span>
          )}
          <span className={`text-xs ${
            status === 'won' ? 'text-status-won' :
            status === 'lost' ? 'text-status-lost' :
            'text-text-muted'
          }`}>
            {status === 'won' ? '✓ Won' :
             status === 'lost' ? '✗ Lost' :
             `${remainingGuesses} left`}
          </span>
        </div>
      </div>

      {/* Compact grid - show all rows */}
      <div className="flex flex-col gap-0.5 items-center flex-1">
        {Array.from({ length: totalGuesses }).map((_, rowIndex) => {
          const guess = guesses[rowIndex];
          const isCurrentRow = rowIndex === guesses.length && status === 'playing';
          const isRevealing = revealingRow === rowIndex;
          const isWinningRow = justWon && rowIndex === guesses.length - 1;

          return (
            <WordleRow
              key={rowIndex}
              tiles={guess?.evaluation}
              currentInput={isCurrentRow && isActive ? currentInput : ''}
              size="sm"
              isRevealing={isRevealing}
              isWinningRow={isWinningRow}
              previousInputLength={isCurrentRow ? previousInputLength : 0}
            />
          );
        })}
      </div>

      {/* Show target word if game is lost */}
      {status === 'lost' && (
        <div className="mt-2 text-center">
          <span className="text-xs text-text-muted">Answer: </span>
          <span className="text-xs font-bold uppercase text-white">{targetWord}</span>
        </div>
      )}
    </div>
  );
}
