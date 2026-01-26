/**
 * Keyboard event handling hook
 */

import { useEffect, useCallback } from 'react';

interface UseKeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

/**
 * Hook to handle keyboard input for the Wordle game
 */
export function useKeyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  disabled = false,
}: UseKeyboardProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      // Ignore if typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'enter') {
        event.preventDefault();
        onEnter();
      } else if (key === 'backspace') {
        event.preventDefault();
        onBackspace();
      } else if (key.length === 1 && key >= 'a' && key <= 'z') {
        event.preventDefault();
        onKeyPress(key);
      }
    },
    [disabled, onKeyPress, onEnter, onBackspace]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
