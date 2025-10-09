/**
 * Hooks barrel export
 * 
 * This file re-exports all custom hooks for convenient importing.
 * Hooks encapsulate stateful logic and side effects.
 * 
 * Usage: import { useDrawingState, useViewportTransform } from '@/hooks';
 */

// Drawing state hook
export {
  useDrawingState,
  type UseDrawingStateReturn,
} from './useDrawingState';

// Viewport transform hook
export {
  useViewportTransform,
  type UseViewportTransformReturn,
} from './useViewportTransform';

// Canvas setup hook
export {
  useCanvasSetup,
  type UseCanvasSetupParams,
} from './useCanvasSetup';

// Keyboard shortcuts hook
export {
  useKeyboardShortcuts,
  type KeyboardShortcutHandlers,
  type UseKeyboardShortcutsParams,
} from './useKeyboardShortcuts';

