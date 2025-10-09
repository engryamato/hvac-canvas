/**
 * Type definitions barrel export
 * 
 * This file re-exports all type definitions for convenient importing.
 * Usage: import { Pt, Line, Scale } from '@/types';
 */

// Canvas types
export type { Pt, ViewportTransform } from './canvas.types';

// Drawing types
export type { Line, DrawingPhase } from './drawing.types';

// Snap types
export type { SnapType, SnapTarget } from './snap.types';

// Scale types
export type {
  ScaleUnit,
  ScaleType,
  Scale,
  LineSummaryRow
} from './scale.types';

