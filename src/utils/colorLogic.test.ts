/**
 * Unit tests for color evaluation logic
 */

import { describe, it, expect } from 'vitest';
import { evaluateGuess, isCorrectGuess, getLettersByState } from './colorLogic';

describe('evaluateGuess', () => {
  describe('basic cases', () => {
    it('should mark all letters correct for exact match', () => {
      const result = evaluateGuess('hello', 'hello');
      expect(result).toEqual([
        { letter: 'h', state: 'correct' },
        { letter: 'e', state: 'correct' },
        { letter: 'l', state: 'correct' },
        { letter: 'l', state: 'correct' },
        { letter: 'o', state: 'correct' },
      ]);
    });

    it('should mark all letters absent for no matches', () => {
      const result = evaluateGuess('abcde', 'fghij');
      expect(result).toEqual([
        { letter: 'a', state: 'absent' },
        { letter: 'b', state: 'absent' },
        { letter: 'c', state: 'absent' },
        { letter: 'd', state: 'absent' },
        { letter: 'e', state: 'absent' },
      ]);
    });

    it('should mark mixed results correctly', () => {
      // hello vs world:
      // h: absent (not in world)
      // e: absent (not in world)
      // l: absent (l is at position 3 in world, not position 2)
      // l: correct (l matches at position 3)
      // o: present (o is in world at position 1, not position 4)
      const result = evaluateGuess('hello', 'world');
      expect(result).toEqual([
        { letter: 'h', state: 'absent' },
        { letter: 'e', state: 'absent' },
        { letter: 'l', state: 'absent' },
        { letter: 'l', state: 'correct' },
        { letter: 'o', state: 'present' },
      ]);
    });
  });

  describe('duplicate letter handling', () => {
    it('should handle double letters in guess - both present', () => {
      // eerie = e-e-r-i-e (positions 0,1,2,3,4)
      // speed = s-p-e-e-d (positions 0,1,2,3,4)
      // s: absent (not in eerie)
      // p: absent (not in eerie)
      // e at pos 2: eerie has 'r' at pos 2, but e is in word -> present
      // e at pos 3: eerie has 'i' at pos 3, but e is in word -> present
      // d: absent (not in eerie)
      // eerie has 3 e's, speed has 2 e's, so both can be present
      const result = evaluateGuess('speed', 'eerie');
      expect(result).toEqual([
        { letter: 's', state: 'absent' },
        { letter: 'p', state: 'absent' },
        { letter: 'e', state: 'present' },
        { letter: 'e', state: 'present' },
        { letter: 'd', state: 'absent' },
      ]);
    });

    it('should handle triple letters correctly', () => {
      // eerie = e-e-r-i-e (positions 0,1,2,3,4) - has 3 e's at 0,1,4
      // geese = g-e-e-s-e (positions 0,1,2,3,4) - has 3 e's at 1,2,4
      // g: absent
      // e at pos 1: eerie has 'e' at pos 1 -> correct
      // e at pos 2: eerie has 'r' at pos 2, but e is in word -> present
      // s: absent
      // e at pos 4: eerie has 'e' at pos 4 -> correct
      const result = evaluateGuess('geese', 'eerie');
      expect(result[0]).toEqual({ letter: 'g', state: 'absent' });
      expect(result[1]).toEqual({ letter: 'e', state: 'correct' });
      expect(result[2]).toEqual({ letter: 'e', state: 'present' });
      expect(result[3]).toEqual({ letter: 's', state: 'absent' });
      expect(result[4]).toEqual({ letter: 'e', state: 'correct' });
    });

    it('should prioritize correct matches over present', () => {
      const result = evaluateGuess('llama', 'label');
      // Target 'label' has: l(2), a(1), b(1), e(1)
      // l: correct (position 0)
      // l: absent (no more l's available after first correct match)
      // a: present (a exists in target but not at position 2)
      // m: absent
      // a: absent (only one a in target, already used)
      expect(result[0]).toEqual({ letter: 'l', state: 'correct' });
      expect(result[1].state).toBe('present'); // second l might be present since there's an l at end
    });

    it('should not mark extra duplicates as present', () => {
      // Target has 1 'o', guess has 2 'o's
      const result = evaluateGuess('foods', 'foggy');
      // f: correct
      // o: correct
      // o: absent (no more o's in target)
      // d: absent
      // s: absent
      expect(result[0]).toEqual({ letter: 'f', state: 'correct' });
      expect(result[1]).toEqual({ letter: 'o', state: 'correct' });
      expect(result[2]).toEqual({ letter: 'o', state: 'absent' });
      expect(result[3]).toEqual({ letter: 'd', state: 'absent' });
      expect(result[4]).toEqual({ letter: 's', state: 'absent' });
    });
  });

  describe('case insensitivity', () => {
    it('should treat uppercase and lowercase the same', () => {
      const result1 = evaluateGuess('HELLO', 'hello');
      const result2 = evaluateGuess('hello', 'HELLO');
      const result3 = evaluateGuess('HeLLo', 'hEllO');

      expect(result1.every(t => t.state === 'correct')).toBe(true);
      expect(result2.every(t => t.state === 'correct')).toBe(true);
      expect(result3.every(t => t.state === 'correct')).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw on null guess', () => {
      expect(() => evaluateGuess(null as unknown as string, 'hello')).toThrow();
    });

    it('should throw on null target', () => {
      expect(() => evaluateGuess('hello', null as unknown as string)).toThrow();
    });

    it('should throw on undefined guess', () => {
      expect(() => evaluateGuess(undefined as unknown as string, 'hello')).toThrow();
    });
  });
});

describe('isCorrectGuess', () => {
  it('should return true for all correct tiles', () => {
    const evaluation = [
      { letter: 'h', state: 'correct' as const },
      { letter: 'e', state: 'correct' as const },
      { letter: 'l', state: 'correct' as const },
      { letter: 'l', state: 'correct' as const },
      { letter: 'o', state: 'correct' as const },
    ];
    expect(isCorrectGuess(evaluation)).toBe(true);
  });

  it('should return false if any tile is not correct', () => {
    const evaluation = [
      { letter: 'h', state: 'correct' as const },
      { letter: 'e', state: 'present' as const },
      { letter: 'l', state: 'correct' as const },
      { letter: 'l', state: 'correct' as const },
      { letter: 'o', state: 'correct' as const },
    ];
    expect(isCorrectGuess(evaluation)).toBe(false);
  });

  it('should return false for all absent tiles', () => {
    const evaluation = [
      { letter: 'a', state: 'absent' as const },
      { letter: 'b', state: 'absent' as const },
      { letter: 'c', state: 'absent' as const },
      { letter: 'd', state: 'absent' as const },
      { letter: 'e', state: 'absent' as const },
    ];
    expect(isCorrectGuess(evaluation)).toBe(false);
  });
});

describe('getLettersByState', () => {
  const evaluation = [
    { letter: 'h', state: 'correct' as const },
    { letter: 'e', state: 'present' as const },
    { letter: 'l', state: 'correct' as const },
    { letter: 'l', state: 'absent' as const },
    { letter: 'o', state: 'present' as const },
  ];

  it('should return correct letters', () => {
    const correct = getLettersByState(evaluation, 'correct');
    expect(correct).toContain('h');
    expect(correct).toContain('l');
    expect(correct).toHaveLength(2); // unique letters
  });

  it('should return present letters', () => {
    const present = getLettersByState(evaluation, 'present');
    expect(present).toContain('e');
    expect(present).toContain('o');
    expect(present).toHaveLength(2);
  });

  it('should return absent letters', () => {
    const absent = getLettersByState(evaluation, 'absent');
    expect(absent).toContain('l');
    expect(absent).toHaveLength(1);
  });

  it('should return unique letters only', () => {
    const duplicateEval = [
      { letter: 'l', state: 'correct' as const },
      { letter: 'l', state: 'correct' as const },
      { letter: 'l', state: 'correct' as const },
    ];
    const letters = getLettersByState(duplicateEval, 'correct');
    expect(letters).toEqual(['l']);
  });
});
