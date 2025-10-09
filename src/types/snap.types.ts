/**
 * Snap system type definitions
 * 
 * This file contains types for the intelligent snap-to-line functionality
 * that helps users connect lines precisely.
 */

import type { Pt } from './canvas.types';

/**
 * Type of snap point
 * - 'endpoint': Snap to the start or end point of a line
 * - 'midpoint': Snap to the middle point of a line
 * - 'line': Snap to any point along a line
 */
export type SnapType = 'endpoint' | 'midpoint' | 'line';

/**
 * Snap target information
 * Represents a potential snap point that the cursor is near
 */
export type SnapTarget = {
  /** ID of the line being snapped to */
  lineId: string;
  /** Exact coordinates of the snap point */
  point: Pt;
  /** Type of snap (endpoint, midpoint, or line) */
  type: SnapType;
  /** Distance from cursor to snap point (in pixels) */
  distance: number;
};

