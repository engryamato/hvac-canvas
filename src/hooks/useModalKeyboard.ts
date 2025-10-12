/**
 * useModalKeyboard Hook
 * 
 * Custom hook for keyboard navigation and focus management in modal.
 * Implements focus trap and keyboard shortcuts.
 */

import { useEffect, useRef } from 'react';

/**
 * Props for useModalKeyboard hook
 */
export interface UseModalKeyboardProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Ref to modal container element */
  modalRef: React.RefObject<HTMLElement>;
}

/**
 * useModalKeyboard Hook
 * 
 * Manages keyboard navigation and focus in modal.
 * 
 * Features:
 * - Escape: Close modal
 * - Tab: Next focusable element (with focus trap)
 * - Shift+Tab: Previous focusable element (with focus trap)
 * - Enter: Activate button/select dropdown
 * - Arrow Up/Down: Navigate dropdown (handled by dropdown component)
 * - Space: Toggle checkbox (native behavior)
 * - Focus trap: Tab cycles within modal only
 * - Returns focus to trigger element on close
 * - Stores initial focus element
 * - Cleanup on unmount
 * 
 * @param props - Hook props
 * 
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDivElement>(null);
 * 
 * useModalKeyboard({
 *   isOpen: true,
 *   onClose: () => setIsOpen(false),
 *   modalRef,
 * });
 * 
 * <div ref={modalRef}>
 *   Modal content
 * </div>
 * ```
 */
export function useModalKeyboard(props: UseModalKeyboardProps): void {
  const { isOpen, onClose, modalRef } = props;

  // Store element that had focus before modal opened
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /**
   * Get all focusable elements in modal
   */
  const getFocusableElements = (): HTMLElement[] => {
    if (!modalRef.current) return [];

    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(modalRef.current.querySelectorAll(selector));
  };

  /**
   * Handle keyboard events
   */
  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first element in modal
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    /**
     * Handle keydown events
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Close modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab: Focus trap
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        if (e.shiftKey) {
          // Shift+Tab: Move to previous element
          if (activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Move to next element
          if (activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, modalRef]);
}

