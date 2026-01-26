/**
 * Keyboard state tracking utilities
 *
 * Aggregates letter states across all games for keyboard coloring.
 */

import type { KeyState, SingleGame } from '../types';

// Priority order: correct > present > absent > unused
const STATE_PRIORITY: Record<KeyState, number> = {
  unused: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

/**
 * Aggregate key states from all games
 *
 * For each letter, the highest priority state across all games is used.
 * This means if a letter is green in any game, it shows as green on the keyboard.
 *
 * @param games - Array of all game states
 * @returns Record of letter to key state
 */
export function aggregateKeyStates(games: SingleGame[]): Record<string, KeyState> {
  const keyStates: Record<string, KeyState> = {};

  // Initialize all letters as unused
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach((letter) => {
    keyStates[letter] = 'unused';
  });

  // Process all guesses from all games
  for (const game of games) {
    for (const guess of game.guesses) {
      for (const tile of guess.evaluation) {
        const currentState = keyStates[tile.letter];
        const newState = tile.state as KeyState;

        // Only update if new state has higher priority
        if (STATE_PRIORITY[newState] > STATE_PRIORITY[currentState]) {
          keyStates[tile.letter] = newState;
        }
      }
    }
  }

  return keyStates;
}

/**
 * Get the CSS class for a key based on its state
 */
export function getKeyClassName(state: KeyState): string {
  return `keyboard-key--${state}`;
}
