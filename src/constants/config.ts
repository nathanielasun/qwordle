/**
 * Game configuration constants
 */

// Qubit range
export const MIN_QUBITS = 1;
export const MAX_QUBITS = 5;

// Guesses per game = 5 + ceil(n/2)
export const BASE_GUESSES = 5;
export const calculateGuesses = (n: number): number => BASE_GUESSES + Math.ceil(n / 2);

// Quantum measurement shots
export const MEASUREMENT_SHOTS = 1024;

// Quantum usage earning: correct letters needed per quantum circuit usage
export const CORRECT_LETTERS_PER_QUANTUM_USAGE = 4;

// Word length
export const WORD_LENGTH = 5;

// Keyboard layout
export const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
] as const;

// Animation durations (ms)
export const FLIP_DURATION = 500;
export const SHAKE_DURATION = 500;
export const REVEAL_DELAY = 200;

// Local storage keys
export const STORAGE_KEYS = {
  STATS: 'qwordle-stats',
  SETTINGS: 'qwordle-settings',
} as const;
