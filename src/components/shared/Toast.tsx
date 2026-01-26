/**
 * Toast - Notification component for feedback messages
 */

import { useEffect, useState } from 'react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeStyles: Record<ToastType, string> = {
  error: 'bg-red-600 border-red-500',
  success: 'bg-wordle-correct border-wordle-correct',
  info: 'bg-quantum-primary border-quantum-primary',
  warning: 'bg-wordle-present border-wordle-present',
};

const typeIcons: Record<ToastType, string> = {
  error: '✗',
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
};

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto-dismiss
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        px-4 py-3 rounded-lg border-2 shadow-lg
        flex items-center gap-2 min-w-[200px] max-w-[90vw]
        transition-all duration-300 ease-out
        ${typeStyles[type]}
        ${isVisible && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
      role="alert"
      aria-live="polite"
    >
      <span className="text-lg" aria-hidden="true">{typeIcons[type]}</span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
