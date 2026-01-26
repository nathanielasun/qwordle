/**
 * WordleGrid - Grid of rows for a single Wordle game
 */

import { WordleRow } from './WordleRow';
import { Guess, GameStatus } from '../../types';

interface WordleGridProps {
  /** Array of submitted guesses */
  guesses: Guess[];
  /** Current input being typed */
  currentInput: string;
  /** Maximum number of guesses allowed */
  maxGuesses: number;
  /** Game status */
  status: GameStatus;
  /** Tile size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to shake current row on invalid */
  isShaking?: boolean;
  /** Index of most recently revealed row (for animation) */
  revealingRow?: number;
}

export function WordleGrid({
  guesses,
  currentInput,
  maxGuesses,
  status,
  size = 'md',
  isShaking = false,
  revealingRow,
}: WordleGridProps) {
  // Generate rows
  const rows: React.ReactNode[] = [];

  for (let i = 0; i < maxGuesses; i++) {
    const guess = guesses[i];
    const isCurrentRow = i === guesses.length && status === 'playing';
    const isRevealing = revealingRow === i;

    rows.push(
      <WordleRow
        key={i}
        tiles={guess?.evaluation}
        currentInput={isCurrentRow ? currentInput : ''}
        isRevealing={isRevealing}
        size={size}
        isShaking={isShaking && isCurrentRow}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      {rows}
    </div>
  );
}
