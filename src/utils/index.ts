/**
 * Utilities barrel export
 * 
 * This file re-exports all utility functions for convenient importing.
 * Usage: import { dist, screenToCanvas, findSnapTarget } from '@/utils';
 */

// Geometry utilities
export {
  dist,
  midpoint,
  getClosestPointOnSegment,
  getLineLength,
} from './geometry';

// Canvas utilities
export {
  screenToCanvas,
  canvasToScreen,
  getPointerPos,
  applyViewportTransform,
  setupHiDPICanvas,
} from './canvas';

// Snap utilities
export {
  findSnapTarget,
  resolveSnapPoint,
} from './snap';

// Scale utilities
export {
  pixelsToInches,
  formatLength,
} from './scale';

// ID utility
export { uid } from './id';

