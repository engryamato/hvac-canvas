/**
 * Modal utilities barrel export
 * 
 * Re-exports all modal positioning utilities for convenient importing.
 * Usage: import { calculateModalPosition, checkBoundaryCollision } from '@/utils/modal';
 */

export {
  calculateModalPosition,
  checkBoundaryCollision,
  adjustPositionForBoundaries,
} from './positioning';

export type { CanvasBounds, ViewportInfo } from './positioning';

