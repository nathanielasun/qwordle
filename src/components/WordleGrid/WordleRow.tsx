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
}

export function WordleRow({
  tiles,
  currentInput = '',
  isRevealing = false,
  size = 'md',
  isShaking = false,
}: WordleRowProps) {
  // Generate tile data for rendering
  const tileData: { letter: string; state: TileState }[] = [];

  // Debug: log what tiles we received
  if (tiles && tiles.length > 0) {
    console.log('WordleRow received tiles:', tiles.map(t => `${t.letter}:${t.state}`).join(', '));
  }

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

  return (
    <div
      className={`flex gap-1 ${isShaking ? 'animate-shake' : ''}`}
    >
      {tileData.map((tile, i) => (
        <WordleTile
          key={i}
          letter={tile.letter}
          state={tile.state}
          size={size}
          isRevealing={isRevealing && tiles !== undefined}
          revealDelay={i * REVEAL_DELAY}
        />
      ))}
    </div>
  );
}
