/**
 * WordleTile - Single letter tile component
 */

import { TileState } from '../../types';

interface WordleTileProps {
  letter: string;
  state: TileState;
  size?: 'sm' | 'md' | 'lg';
  isRevealing?: boolean;
  revealDelay?: number;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-xl',
  lg: 'w-14 h-14 text-2xl',
};

// Inline style colors as fallback
const stateColors: Record<TileState, { background: string; border: string }> = {
  correct: { background: '#6aaa64', border: '#6aaa64' },
  present: { background: '#c9b458', border: '#c9b458' },
  absent: { background: '#787c7e', border: '#787c7e' },
  empty: { background: '#121213', border: '#3a3a3c' },
};

export function WordleTile({
  letter,
  state,
  size = 'md',
  isRevealing = false,
  revealDelay = 0,
}: WordleTileProps) {
  const stateClass = `wordle-tile--${state}`;
  const sizeClass = sizeClasses[size];

  // Null safety - display empty string if letter is null/undefined
  const displayLetter = letter ? letter.toUpperCase() : '';

  // Get colors for this state
  const colors = stateColors[state] || stateColors.empty;

  return (
    <div
      className={`wordle-tile ${stateClass} ${sizeClass} ${isRevealing ? 'animate-flip' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        animationDelay: isRevealing ? `${revealDelay}ms` : undefined,
      }}
    >
      {displayLetter}
    </div>
  );
}
