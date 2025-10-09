/**
 * Drawing-related type definitions
 * 
 * This file contains types for lines, drawing state, and drawing interactions.
 */

import type { Pt } from './canvas.types';

/**
 * Line model
 * Represents a drawn line segment on the canvas
 */
export type Line = {
  /** Unique identifier for the line */
  id: string;
  /** Start point of the line */
  a: Pt;
  /** End point of the line */
  b: Pt;
  /** Visual line width in pixels (represents duct centerline) */
  width: number;
  /** Stroke color (hex or CSS color string) */
  color: string;
};

/**
 * Drawing phase for click-click interaction
 * - 'idle': Not currently drawing, waiting for first click
 * - 'waiting-for-end': First point set, waiting for second click to complete line
 */
export type DrawingPhase = 'idle' | 'waiting-for-end';

