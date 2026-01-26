/**
 * Unit tests for localStorage utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadLifetimeStats,
  saveLifetimeStats,
  updateLifetimeStats,
  resetLifetimeStats,
} from './localStorage';
import type { LifetimeStats, GameStats } from '../types';

describe('localStorage utilities', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockClear();
  });

  describe('loadLifetimeStats', () => {
    it('should return default stats when nothing stored', () => {
      const stats = loadLifetimeStats();

      expect(stats.sessionsPlayed).toBe(0);
      expect(stats.totalGamesPlayed).toBe(0);
      expect(stats.totalGamesWon).toBe(0);
      expect(stats.perfectGames).toBe(0);
      expect(stats.bestWinStreak).toBe(0);
      expect(stats.currentWinStreak).toBe(0);
    });

    it('should load stored stats', () => {
      const storedStats: LifetimeStats = {
        sessionsPlayed: 5,
        totalGamesPlayed: 20,
        totalGamesWon: 15,
        totalGuesses: 100,
        totalBonusGuessesUsed: 10,
        totalQuantumMeasurements: 5,
        perfectGames: 2,
        bestWinStreak: 3,
        currentWinStreak: 1,
        lastPlayed: 1234567890,
        statsByN: { 2: { sessionsPlayed: 3, gamesWon: 10, gamesPlayed: 12 } },
      };

      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(storedStats));

      const stats = loadLifetimeStats();
      expect(stats.sessionsPlayed).toBe(5);
      expect(stats.totalGamesWon).toBe(15);
      expect(stats.perfectGames).toBe(2);
    });

    it('should handle invalid JSON gracefully', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid json');

      const stats = loadLifetimeStats();
      expect(stats.sessionsPlayed).toBe(0); // Default value
    });

    it('should merge with defaults for missing fields', () => {
      const partialStats = { sessionsPlayed: 5 };
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(partialStats));

      const stats = loadLifetimeStats();
      expect(stats.sessionsPlayed).toBe(5);
      expect(stats.totalGamesPlayed).toBe(0); // Default
      expect(stats.statsByN).toEqual({}); // Default
    });
  });

  describe('saveLifetimeStats', () => {
    it('should save stats to localStorage', () => {
      const stats: LifetimeStats = {
        sessionsPlayed: 1,
        totalGamesPlayed: 4,
        totalGamesWon: 3,
        totalGuesses: 20,
        totalBonusGuessesUsed: 2,
        totalQuantumMeasurements: 1,
        perfectGames: 0,
        bestWinStreak: 0,
        currentWinStreak: 0,
        lastPlayed: Date.now(),
        statsByN: {},
      };

      saveLifetimeStats(stats);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'qwordle-stats',
        expect.any(String)
      );

      const savedData = JSON.parse(
        vi.mocked(localStorage.setItem).mock.calls[0][1]
      );
      expect(savedData.sessionsPlayed).toBe(1);
      expect(savedData.totalGamesWon).toBe(3);
    });
  });

  describe('updateLifetimeStats', () => {
    const sessionStats: GameStats = {
      totalGames: 4,
      gamesWon: 3,
      gamesLost: 1,
      totalGuesses: 20,
      bonusGuessesUsed: 2,
      quantumMeasurements: 1,
    };

    it('should increment session count', () => {
      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);

      expect(updated.sessionsPlayed).toBe(1);
    });

    it('should add games played and won', () => {
      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);

      expect(updated.totalGamesPlayed).toBe(4);
      expect(updated.totalGamesWon).toBe(3);
    });

    it('should track perfect games', () => {
      // All 4 games won = perfect
      const updated = updateLifetimeStats(sessionStats, 2, 4, 4);

      expect(updated.perfectGames).toBe(1);
    });

    it('should not count non-perfect as perfect', () => {
      // Only 3 of 4 games won
      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);

      expect(updated.perfectGames).toBe(0);
    });

    it('should update win streak on perfect game', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          currentWinStreak: 2,
          bestWinStreak: 2,
          sessionsPlayed: 2,
          totalGamesPlayed: 8,
          totalGamesWon: 8,
          totalGuesses: 40,
          totalBonusGuessesUsed: 0,
          totalQuantumMeasurements: 0,
          perfectGames: 2,
          lastPlayed: 0,
          statsByN: {},
        })
      );

      const updated = updateLifetimeStats(sessionStats, 2, 4, 4);

      expect(updated.currentWinStreak).toBe(3);
      expect(updated.bestWinStreak).toBe(3);
    });

    it('should reset win streak on non-perfect game', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          currentWinStreak: 5,
          bestWinStreak: 5,
          sessionsPlayed: 5,
          totalGamesPlayed: 20,
          totalGamesWon: 20,
          totalGuesses: 100,
          totalBonusGuessesUsed: 0,
          totalQuantumMeasurements: 0,
          perfectGames: 5,
          lastPlayed: 0,
          statsByN: {},
        })
      );

      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);

      expect(updated.currentWinStreak).toBe(0);
      expect(updated.bestWinStreak).toBe(5); // Best preserved
    });

    it('should track stats by n', () => {
      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);

      expect(updated.statsByN[2]).toBeDefined();
      expect(updated.statsByN[2].sessionsPlayed).toBe(1);
      expect(updated.statsByN[2].gamesWon).toBe(3);
      expect(updated.statsByN[2].gamesPlayed).toBe(4);
    });

    it('should accumulate stats by n', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          sessionsPlayed: 1,
          totalGamesPlayed: 4,
          totalGamesWon: 4,
          totalGuesses: 20,
          totalBonusGuessesUsed: 0,
          totalQuantumMeasurements: 0,
          perfectGames: 1,
          bestWinStreak: 1,
          currentWinStreak: 1,
          lastPlayed: 0,
          statsByN: { 2: { sessionsPlayed: 1, gamesWon: 4, gamesPlayed: 4 } },
        })
      );

      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);

      expect(updated.statsByN[2].sessionsPlayed).toBe(2);
      expect(updated.statsByN[2].gamesWon).toBe(7);
      expect(updated.statsByN[2].gamesPlayed).toBe(8);
    });

    it('should set lastPlayed timestamp', () => {
      const before = Date.now();
      const updated = updateLifetimeStats(sessionStats, 2, 3, 4);
      const after = Date.now();

      expect(updated.lastPlayed).toBeGreaterThanOrEqual(before);
      expect(updated.lastPlayed).toBeLessThanOrEqual(after);
    });
  });

  describe('resetLifetimeStats', () => {
    it('should save default stats', () => {
      resetLifetimeStats();

      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(
        vi.mocked(localStorage.setItem).mock.calls[0][1]
      );
      expect(savedData.sessionsPlayed).toBe(0);
      expect(savedData.totalGamesPlayed).toBe(0);
    });
  });
});
