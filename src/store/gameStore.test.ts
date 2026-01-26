/**
 * Unit tests for game state store
 */

import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { useGameStore } from './gameStore';
import { loadWordList } from '../utils/wordValidation';

// Mock word list data
const mockWordListData = {
  validWords: ['hello', 'world', 'apple', 'grape', 'tests', 'words', 'crane', 'slate'],
  targetWords: ['hello', 'world', 'apple', 'grape', 'crane', 'slate'],
};

describe('gameStore', () => {
  // Load word list once before all tests
  beforeAll(async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWordListData),
    } as Response);
    await loadWordList();
  });

  // Reset store state before each test
  beforeEach(() => {
    useGameStore.setState({
      n: 2,
      phase: 'setup',
      games: [],
      currentGuess: '',
      errorMessage: null,
      stats: {
        totalGames: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalGuesses: 0,
        bonusGuessesUsed: 0,
        quantumMeasurements: 0,
      },
      recentBonusGame: null,
      keyStates: {},
      totalCorrectLetters: 0,
      quantumUsagesAvailable: 0,
      quantumUsagesUsed: 0,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useGameStore.getState();
      expect(state.phase).toBe('setup');
      expect(state.games).toHaveLength(0);
      expect(state.currentGuess).toBe('');
      expect(state.quantumUsagesAvailable).toBe(0);
    });
  });

  describe('initializeGames', () => {
    it('should initialize correct number of games for n=1', () => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(1);

      const state = useGameStore.getState();
      expect(state.n).toBe(1);
      expect(state.games).toHaveLength(2); // 2^1 = 2
      expect(state.phase).toBe('playing');
    });

    it('should initialize correct number of games for n=2', () => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(2);

      const state = useGameStore.getState();
      expect(state.n).toBe(2);
      expect(state.games).toHaveLength(4); // 2^2 = 4
    });

    it('should set correct binary labels', () => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(2);

      const state = useGameStore.getState();
      expect(state.games[0].binaryLabel).toBe('00');
      expect(state.games[1].binaryLabel).toBe('01');
      expect(state.games[2].binaryLabel).toBe('10');
      expect(state.games[3].binaryLabel).toBe('11');
    });

    it('should set all games to playing status', () => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(2);

      const state = useGameStore.getState();
      state.games.forEach((game) => {
        expect(game.status).toBe('playing');
      });
    });

    it('should set unique target words', () => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(2);

      const state = useGameStore.getState();
      const words = state.games.map((g) => g.targetWord);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(words.length);
    });

    it('should reset stats', () => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(2);

      const state = useGameStore.getState();
      expect(state.stats.totalGuesses).toBe(0);
      expect(state.stats.gamesWon).toBe(0);
      expect(state.stats.gamesLost).toBe(0);
    });
  });

  describe('setCurrentGuess', () => {
    it('should set current guess', () => {
      const { setCurrentGuess } = useGameStore.getState();
      setCurrentGuess('hel');

      const state = useGameStore.getState();
      expect(state.currentGuess).toBe('hel');
    });

    it('should limit guess to 5 characters', () => {
      const { setCurrentGuess } = useGameStore.getState();
      setCurrentGuess('toolong');

      const state = useGameStore.getState();
      expect(state.currentGuess).toBe('toolo');
    });

    it('should convert to lowercase', () => {
      const { setCurrentGuess } = useGameStore.getState();
      setCurrentGuess('HELLO');

      const state = useGameStore.getState();
      expect(state.currentGuess).toBe('hello');
    });

    it('should clear error message', () => {
      useGameStore.setState({ errorMessage: 'Some error' });
      const { setCurrentGuess } = useGameStore.getState();
      setCurrentGuess('test');

      const state = useGameStore.getState();
      expect(state.errorMessage).toBeNull();
    });
  });

  describe('submitGuess', () => {
    beforeEach(() => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(1);
      // Set known target words for predictable testing
      useGameStore.setState((state) => ({
        games: state.games.map((game, i) => ({
          ...game,
          targetWord: i === 0 ? 'hello' : 'world',
        })),
      }));
    });

    it('should reject too short guess', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('hi');
      submitGuess();

      const state = useGameStore.getState();
      expect(state.errorMessage).toContain('5 letters');
    });

    it('should reject invalid word', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('zzzzz');
      submitGuess();

      const state = useGameStore.getState();
      expect(state.errorMessage).toContain('Not in word list');
    });

    it('should add guess to all active games', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('crane');
      submitGuess();

      const state = useGameStore.getState();
      state.games.forEach((game) => {
        expect(game.guesses).toHaveLength(1);
        expect(game.guesses[0].word).toBe('crane');
      });
    });

    it('should increment total guesses', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('crane');
      submitGuess();

      const state = useGameStore.getState();
      expect(state.stats.totalGuesses).toBe(1);
    });

    it('should clear current guess after submit', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('crane');
      submitGuess();

      const state = useGameStore.getState();
      expect(state.currentGuess).toBe('');
    });

    it('should mark game as won when correct', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('hello'); // Matches game 0's target
      submitGuess();

      const state = useGameStore.getState();
      expect(state.games[0].status).toBe('won');
      expect(state.stats.gamesWon).toBe(1);
    });

    it('should track correct letters for quantum charges', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('hello'); // All correct for game 0
      submitGuess();

      const state = useGameStore.getState();
      // 5 correct letters in game 0 + some from game 1 = at least 5
      expect(state.totalCorrectLetters).toBeGreaterThanOrEqual(5);
    });

    it('should award quantum charge after 4 correct letters', () => {
      const { setCurrentGuess, submitGuess } = useGameStore.getState();
      setCurrentGuess('hello'); // 5 correct for game 0
      submitGuess();

      const state = useGameStore.getState();
      // 5+ correct letters should give at least 1 charge
      expect(state.quantumUsagesAvailable).toBeGreaterThanOrEqual(1);
    });
  });

  describe('useQuantumCharge', () => {
    it('should decrement available charges', () => {
      useGameStore.setState({ quantumUsagesAvailable: 2 });
      const { useQuantumCharge } = useGameStore.getState();
      const success = useQuantumCharge();

      expect(success).toBe(true);
      const state = useGameStore.getState();
      expect(state.quantumUsagesAvailable).toBe(1);
      expect(state.quantumUsagesUsed).toBe(1);
    });

    it('should return false when no charges available', () => {
      useGameStore.setState({ quantumUsagesAvailable: 0 });
      const { useQuantumCharge } = useGameStore.getState();
      const success = useQuantumCharge();

      expect(success).toBe(false);
      const state = useGameStore.getState();
      expect(state.quantumUsagesAvailable).toBe(0);
    });
  });

  describe('addBonusToGame', () => {
    beforeEach(() => {
      const { initializeGames } = useGameStore.getState();
      initializeGames(2);
    });

    it('should add bonus guess to specified game', () => {
      const { addBonusToGame } = useGameStore.getState();
      addBonusToGame(1);

      const state = useGameStore.getState();
      expect(state.games[1].bonusGuesses).toBe(1);
    });

    it('should increment bonus stats', () => {
      const { addBonusToGame } = useGameStore.getState();
      addBonusToGame(0);

      const state = useGameStore.getState();
      expect(state.stats.bonusGuessesUsed).toBe(1);
      expect(state.stats.quantumMeasurements).toBe(1);
    });

    it('should set recent bonus game', () => {
      const { addBonusToGame } = useGameStore.getState();
      addBonusToGame(2);

      const state = useGameStore.getState();
      expect(state.recentBonusGame).toBe(2);
    });

    it('should not add bonus to won game', () => {
      useGameStore.setState((state) => ({
        games: state.games.map((game, i) =>
          i === 0 ? { ...game, status: 'won' as const } : game
        ),
      }));

      const { addBonusToGame } = useGameStore.getState();
      addBonusToGame(0);

      const state = useGameStore.getState();
      expect(state.games[0].bonusGuesses).toBe(0);
    });

    it('should not add bonus to invalid index', () => {
      const { addBonusToGame } = useGameStore.getState();
      addBonusToGame(99);

      const state = useGameStore.getState();
      expect(state.stats.bonusGuessesUsed).toBe(0);
    });
  });

  describe('resetGame', () => {
    it('should reset to setup phase', () => {
      const { initializeGames, resetGame } = useGameStore.getState();
      initializeGames(2);
      resetGame();

      const state = useGameStore.getState();
      expect(state.phase).toBe('setup');
      expect(state.games).toHaveLength(0);
      expect(state.currentGuess).toBe('');
      expect(state.quantumUsagesAvailable).toBe(0);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      useGameStore.setState({ errorMessage: 'Test error' });
      const { clearError } = useGameStore.getState();
      clearError();

      const state = useGameStore.getState();
      expect(state.errorMessage).toBeNull();
    });
  });
});
