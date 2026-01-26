/**
 * Keyboard - Virtual keyboard component for Wordle input
 * Memoized to prevent unnecessary re-renders
 */

import { memo, useCallback } from 'react';
import { KeyState } from '../../types';
import { KEYBOARD_ROWS } from '../../constants/config';

interface KeyboardProps {
  /** Map of letter -> state for coloring keys */
  keyStates: Record<string, KeyState>;
  /** Callback when a letter key is pressed */
  onKeyPress: (key: string) => void;
  /** Callback when Enter is pressed */
  onEnter: () => void;
  /** Callback when Backspace is pressed */
  onBackspace: () => void;
  /** Whether the keyboard is disabled */
  disabled?: boolean;
}

export const Keyboard = memo(function Keyboard({
  keyStates,
  onKeyPress,
  onEnter,
  onBackspace,
  disabled = false,
}: KeyboardProps) {
  const handleClick = useCallback((key: string) => {
    if (disabled) return;

    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACK') {
      onBackspace();
    } else {
      onKeyPress(key.toLowerCase());
    }
  }, [disabled, onEnter, onBackspace, onKeyPress]);

  const getKeyClass = (key: string): string => {
    if (key === 'ENTER' || key === 'BACK') {
      return 'keyboard-key--action';
    }

    const state = keyStates[key.toLowerCase()] || 'unused';
    return `keyboard-key--${state}`;
  };

  const getAriaLabel = (key: string): string => {
    if (key === 'ENTER') return 'Submit guess';
    if (key === 'BACK') return 'Delete letter';

    const state = keyStates[key.toLowerCase()] || 'unused';
    const stateDescriptions: Record<KeyState, string> = {
      unused: 'not used yet',
      correct: 'correct in at least one position',
      present: 'present in word',
      absent: 'not in any word',
    };
    return `${key}, ${stateDescriptions[state]}`;
  };

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      role="group"
      aria-label="Virtual keyboard"
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              disabled={disabled}
              aria-label={getAriaLabel(key)}
              className={`keyboard-key ${getKeyClass(key)} ${
                key === 'ENTER' || key === 'BACK' ? 'keyboard-key--wide' : ''
              }`}
            >
              {key === 'BACK' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
});
