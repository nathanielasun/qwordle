/**
 * WordleTile - Single letter tile component
 * Memoized to prevent unnecessary re-renders
 */

import { memo, useEffect, useState } from 'react';
import { TileState } from '../../types';

interface WordleTileProps {
  letter: string;
  state: TileState;
  size?: 'sm' | 'md' | 'lg';
  isRevealing?: boolean;
  revealDelay?: number;
  isWinningTile?: boolean;
  winDelay?: number;
  isNewLetter?: boolean;
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

// Colors before reveal (just the letter, no evaluation color)
const filledColors = { background: '#121213', border: '#565758' };

export const WordleTile = memo(function WordleTile({
  letter,
  state,
  size = 'md',
  isRevealing = false,
  revealDelay = 0,
  isWinningTile = false,
  winDelay = 0,
  isNewLetter = false,
}: WordleTileProps) {
  const [hasRevealed, setHasRevealed] = useState(!isRevealing);
  const [showPop, setShowPop] = useState(false);

  // Handle the reveal animation timing - show color after flip midpoint
  useEffect(() => {
    if (isRevealing && !hasRevealed) {
      const timer = setTimeout(() => {
        setHasRevealed(true);
      }, revealDelay + 250); // 250ms is halfway through the 500ms flip
      return () => clearTimeout(timer);
    }
  }, [isRevealing, revealDelay, hasRevealed]);

  // Handle pop animation for new letters
  useEffect(() => {
    if (isNewLetter && letter) {
      setShowPop(true);
      const timer = setTimeout(() => setShowPop(false), 100);
      return () => clearTimeout(timer);
    }
  }, [letter, isNewLetter]);

  const stateClass = `wordle-tile--${state}`;
  const sizeClass = sizeClasses[size];

  // Null safety - display empty string if letter is null/undefined
  const displayLetter = letter ? letter.toUpperCase() : '';

  // Generate ARIA label for accessibility
  const getAriaLabel = () => {
    if (!letter) return 'Empty tile';
    const stateDescriptions: Record<TileState, string> = {
      correct: 'correct position',
      present: 'wrong position',
      absent: 'not in word',
      empty: 'not evaluated',
    };
    return `${displayLetter}, ${stateDescriptions[state]}`;
  };

  // Get colors based on reveal state
  const colors = hasRevealed
    ? (stateColors[state] || stateColors.empty)
    : (state === 'empty' ? stateColors.empty : filledColors);

  // Determine animation classes
  const animationClasses = [
    isRevealing ? 'animate-flip-reveal' : '',
    isWinningTile ? 'animate-bounce-win' : '',
    showPop ? 'animate-pop' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`wordle-tile ${stateClass} ${sizeClass} ${animationClasses}`}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        animationDelay: isRevealing
          ? `${revealDelay}ms`
          : isWinningTile
          ? `${winDelay}ms`
          : undefined,
      }}
      role="img"
      aria-label={getAriaLabel()}
    >
      {displayLetter}
    </div>
  );
});
