/**
 * Unit tests for word validation utilities
 *
 * Note: The wordValidation module maintains internal state (cached word lists).
 * Tests should be designed to work with or account for this caching behavior.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import {
  loadWordList,
  isWordListLoaded,
  isValidWord,
  getRandomWord,
  getRandomWords,
  validateInput,
  getWordCount,
  getTargetWordCount,
} from './wordValidation';

// Mock word list data
const mockWordListData = {
  validWords: ['hello', 'world', 'apple', 'grape', 'tests', 'words', 'extra', 'valid'],
  targetWords: ['hello', 'world', 'apple', 'grape'],
};

describe('wordValidation', () => {
  // Load word list once before all tests
  beforeAll(async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWordListData),
    } as Response);
    await loadWordList();
  });

  describe('loadWordList', () => {
    it('should have loaded word list', () => {
      expect(isWordListLoaded()).toBe(true);
    });

    it('should have correct word count', () => {
      expect(getWordCount()).toBe(mockWordListData.validWords.length);
      expect(getTargetWordCount()).toBe(mockWordListData.targetWords.length);
    });
  });

  describe('validateInput', () => {
    it('should accept valid 5-letter word', () => {
      const result = validateInput('hello');
      expect(result.valid).toBe(true);
      expect(result.word).toBe('hello');
    });

    it('should reject empty input', () => {
      const result = validateInput('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a word');
    });

    it('should reject null input', () => {
      const result = validateInput(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a word');
    });

    it('should reject too short word', () => {
      const result = validateInput('hi');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5 letters');
    });

    it('should reject too long word', () => {
      const result = validateInput('toolong');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5 letters');
    });

    it('should reject non-alphabetic characters', () => {
      const result = validateInput('hel1o');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Only letters');
    });

    it('should reject word not in list', () => {
      const result = validateInput('zzzzz');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Not in word list');
    });

    it('should handle uppercase input', () => {
      const result = validateInput('HELLO');
      expect(result.valid).toBe(true);
      expect(result.word).toBe('hello');
    });

    it('should handle mixed case input', () => {
      const result = validateInput('HeLLo');
      expect(result.valid).toBe(true);
      expect(result.word).toBe('hello');
    });

    it('should trim whitespace', () => {
      const result = validateInput('  hello  ');
      expect(result.valid).toBe(true);
      expect(result.word).toBe('hello');
    });
  });

  describe('isValidWord', () => {
    it('should return true for valid words', () => {
      expect(isValidWord('hello')).toBe(true);
      expect(isValidWord('world')).toBe(true);
      expect(isValidWord('extra')).toBe(true); // in validWords only
    });

    it('should return false for invalid words', () => {
      expect(isValidWord('zzzzz')).toBe(false);
      expect(isValidWord('notaw')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isValidWord('HELLO')).toBe(true);
      expect(isValidWord('HeLLo')).toBe(true);
    });
  });

  describe('getRandomWord', () => {
    it('should return a word from target list', () => {
      const word = getRandomWord();
      expect(mockWordListData.targetWords).toContain(word);
    });

    it('should return different words on multiple calls', () => {
      const words = new Set<string>();
      for (let i = 0; i < 20; i++) {
        words.add(getRandomWord());
      }
      // Should have gotten at least 2 different words
      expect(words.size).toBeGreaterThan(1);
    });
  });

  describe('getRandomWords', () => {
    it('should return requested number of words', () => {
      const words = getRandomWords(3);
      expect(words).toHaveLength(3);
    });

    it('should return unique words', () => {
      const words = getRandomWords(4);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBe(4);
    });

    it('should throw if requesting more words than available', () => {
      expect(() => getRandomWords(10)).toThrow();
    });

    it('should return all valid words', () => {
      const words = getRandomWords(2);
      words.forEach(word => {
        expect(mockWordListData.targetWords).toContain(word);
      });
    });
  });

});
