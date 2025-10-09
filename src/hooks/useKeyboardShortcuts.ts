/**
 * useKeyboardShortcuts Hook
 * 
 * Manages keyboard shortcuts for the drawing canvas.
 * Handles all keyboard interactions including draw mode toggle,
 * width adjustments, deletion, and drawing cancellation.
 */

import { useEffect } from 'react';

/**
 * Keyboard shortcut handlers
 */
export interface KeyboardShortcutHandlers {
  /** Toggle draw mode (D key) */
  onToggleDrawMode?: () => void;
  /** Cancel current drawing operation (Escape key) */
  onCancelDrawing?: () => void;
  /** Delete selected line (Delete/Backspace key) */
  onDeleteSelected?: () => void;
  /** Increase width (] key) */
  onIncreaseWidth?: () => void;
  /** Decrease width ([ key) */
  onDecreaseWidth?: () => void;
  /** Zoom in (+ key) */
  onZoomIn?: () => void;
  /** Zoom out (- key) */
  onZoomOut?: () => void;
  /** Reset zoom (0 key) */
  onResetZoom?: () => void;
}

/**
 * Parameters for useKeyboardShortcuts hook
 */
export interface UseKeyboardShortcutsParams {
  /** Keyboard shortcut handlers */
  handlers: KeyboardShortcutHandlers;
  /** Whether a line is currently selected */
  hasSelection?: boolean;
  /** Whether draw mode is active */
  isDrawActive?: boolean;
  /** Whether currently in drawing phase (waiting for end point) */
  isDrawing?: boolean;
}

/**
 * Custom hook for keyboard shortcuts
 * 
 * Manages all keyboard interactions for the drawing canvas:
 * - D: Toggle draw mode
 * - Escape: Cancel current drawing operation
 * - Delete/Backspace: Delete selected line
 * - [: Decrease width (selected line or default width)
 * - ]: Increase width (selected line or default width)
 * - +: Zoom in
 * - -: Zoom out
 * - 0: Reset zoom
 * 
 * The hook automatically handles:
 * - Event listener registration and cleanup
 * - Preventing default browser behavior (e.g., Backspace navigation)
 * - Context-aware shortcuts (e.g., width adjustment applies to selection or default)
 * 
 * @param params - Keyboard shortcut parameters
 * 
 * @example
 * useKeyboardShortcuts({
 *   handlers: {
 *     onToggleDrawMode: () => setIsDrawActive(v => !v),
 *     onCancelDrawing: () => drawingState.reset(),
 *     onDeleteSelected: () => deleteLine(selectedId),
 *     onIncreaseWidth: () => updateWidth(w => w + 1),
 *     onDecreaseWidth: () => updateWidth(w => w - 1),
 *   },
 *   hasSelection: !!selectedId,
 *   isDrawActive,
 *   isDrawing: drawingState.phase === 'waiting-for-end'
 * });
 */
export function useKeyboardShortcuts(params: UseKeyboardShortcutsParams): void {
  const { handlers, hasSelection, isDrawActive, isDrawing } = params;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // D key: Toggle draw mode
      if (e.key.toLowerCase() === 'd') {
        handlers.onToggleDrawMode?.();
        return;
      }

      // Escape key: Cancel current drawing operation
      if (e.key === 'Escape' && isDrawing) {
        handlers.onCancelDrawing?.();
        return;
      }

      // Delete/Backspace key: Delete selected line
      if ((e.key === 'Delete' || e.key === 'Backspace') && hasSelection) {
        e.preventDefault(); // Prevent browser back navigation on Backspace
        handlers.onDeleteSelected?.();
        return;
      }

      // Width adjustment keys: [ and ]
      // Apply to selected line if one is selected, otherwise to default width
      if (e.key === '[') {
        handlers.onDecreaseWidth?.();
        return;
      }

      if (e.key === ']') {
        handlers.onIncreaseWidth?.();
        return;
      }

      // Zoom keys: +, -, 0
      if (e.key === '+' || e.key === '=') {
        handlers.onZoomIn?.();
        return;
      }

      if (e.key === '-' || e.key === '_') {
        handlers.onZoomOut?.();
        return;
      }

      if (e.key === '0') {
        handlers.onResetZoom?.();
        return;
      }
    };

    // Register event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, hasSelection, isDrawActive, isDrawing]);
}

