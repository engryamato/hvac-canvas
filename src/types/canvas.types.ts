/**
 * Canvas-related type definitions
 * 
 * This file contains core geometric types and viewport transformation types
 * used throughout the canvas drawing system.
 */

/**
 * Point in 2D space
 * Represents a coordinate with x and y values
 */
export type Pt = {
  x: number;
  y: number;
};

/**
 * Viewport transformation state
 * Controls zoom (scale) and pan (offset) of the canvas view
 */
export type ViewportTransform = {
  /** Zoom level (1.0 = 100%, 0.1 = 10%, 10.0 = 1000%) */
  scale: number;
  /** Pan offset in screen pixels */
  offset: Pt;
};

