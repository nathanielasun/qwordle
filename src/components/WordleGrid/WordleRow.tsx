/**
 * WordleRow - Row of 5 tiles for a single guess
 */

import { WordleTile } from './WordleTile';
import { EvaluatedTile, TileState } from '../../types';
import { WORD_LENGTH, REVEAL_DELAY } from '../../constants/config';

interface WordleRowProps {
  /** Evaluated tiles (for submitted guesses) */
  tiles?: EvaluatedTile[];
  /** Current input (for active row) */
  currentInput?: string;
  /** Whether this row is being revealed */
  isRevealing?: boolean;
  /** Tile size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to shake on invalid */
  isShaking?: boolean;
  /** Whether this is a winning row (triggers bounce animation) */
  isWinningRow?: boolean;
  /** Previous input length for detecting new letters */
  previousInputLength?: number;
}

export function WordleRow({
  tiles,
  currentInput = '',
  isRevealing = false,
  size = 'md',
  isShaking = false,
  isWinningRow = false,
  previousInputLength = 0,
}: WordleRowProps) {
  // Generate tile data for rendering
  const tileData: { letter: string; state: TileState }[] = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (tiles && tiles[i]) {
      // Submitted guess - use evaluated tiles
      tileData.push({
        letter: tiles[i].letter,
        state: tiles[i].state,
      });
    } else if (currentInput && currentInput[i]) {
      // Current input - show letter but empty state
      tileData.push({
        letter: currentInput[i],
        state: 'empty',
      });
    } else {
      // Empty tile
      tileData.push({
        letter: '',
        state: 'empty',
      });
    }
  }

  // Check if all tiles are correct (for winning animation)
  const isAllCorrect = tiles && tiles.every(t => t.state === 'correct');

  // Generate ARIA label for the row
  const getRowAriaLabel = () => {
    if (tiles) {
      const word = tiles.map(t => t.letter).join('').toUpperCase();
      return `Guess: ${word}`;
    }
    if (currentInput) {
      return `Current input: ${currentInput.toUpperCase()}`;
    }
    return 'Empty row';
  };

  return (
    <div
      className={`flex gap-1 ${isShaking ? 'animate-shake' : ''}`}
      role="row"
      aria-label={getRowAriaLabel()}
    >
      {tileData.map((tile, i) => (
        <WordleTile
          key={i}
          letter={tile.letter}
          state={tile.state}
          size={size}
          isRevealing={isRevealing && tiles !== undefined}
          revealDelay={i * REVEAL_DELAY}
          isWinningTile={isWinningRow && isAllCorrect}
          winDelay={i * 100 + (WORD_LENGTH * REVEAL_DELAY)} // Start after reveal completes
          isNewLetter={!tiles && i === currentInput.length - 1 && i >= previousInputLength}
        />
      ))}
    </div>
  );
}
