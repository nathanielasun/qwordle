/**
 * Game type definitions for QWordle
 */

// Tile evaluation states
export type TileState = 'correct' | 'present' | 'absent' | 'empty';

// Keyboard key states
export type KeyState = 'unused' | 'absent' | 'present' | 'correct';

// Game status
export type GameStatus = 'playing' | 'won' | 'lost';

// Overall game phase
export type GamePhase = 'setup' | 'playing' | 'finished';

// Evaluated tile (letter + state)
export interface EvaluatedTile {
  letter: string;
  state: TileState;
}

// A single guess with evaluation
export interface Guess {
  word: string;
  evaluation: EvaluatedTile[];
  timestamp: number;
}

// Single game state
export interface SingleGame {
  id: number;
  binaryLabel: string;
  targetWord: string;
  guesses: Guess[];
  maxGuesses: number;
  bonusGuesses: number;
  status: GameStatus;
}

// Multi-game state
export interface MultiGameState {
  n: number;
  games: SingleGame[];
  currentGuess: string;
  phase: GamePhase;
}

// Game statistics
export interface GameStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  totalGuesses: number;
  bonusGuessesUsed: number;
  quantumMeasurements: number;
}

// Guess submission result
export interface GuessResult {
  success: boolean;
  error?: string;
  evaluation?: EvaluatedTile[];
  gameWon?: boolean;
  gameLost?: boolean;
}

// Word validation result
export interface ValidationResult {
  valid: boolean;
  word?: string;
  error?: string;
}
