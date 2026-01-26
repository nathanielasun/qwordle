/**
 * GameCard - Compact display of a single game within the multi-game view
 */

import { WordleRow } from '../WordleGrid';
import { SingleGame } from '../../types';

interface GameCardProps {
  game: SingleGame;
  currentInput: string;
  isActive: boolean;
  hasBonus?: boolean;
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

  // Determine card styling based on status
  const statusClass =
    status === 'won' ? 'game-card--won' :
    status === 'lost' ? 'game-card--lost' : '';

  const bonusClass = hasBonus ? 'game-card--bonus' : '';

  return (
    <div className={`game-card ${statusClass} ${bonusClass} flex flex-col`}>
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

          return (
            <WordleRow
              key={rowIndex}
              tiles={guess?.evaluation}
              currentInput={isCurrentRow && isActive ? currentInput : ''}
              size="sm"
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
