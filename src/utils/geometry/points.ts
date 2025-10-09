/**
 * Point geometry utilities
 * 
 * This file contains utility functions for working with 2D points.
 */

import type { Pt } from '../../types';

/**
 * Calculate the Euclidean distance between two points
 * Uses the Pythagorean theorem: distance = √((x₂-x₁)² + (y₂-y₁)²)
 * 
 * @param a - First point
 * @param b - Second point
 * @returns Distance between the two points in pixels
 * 
 * @example
 * const distance = dist({ x: 0, y: 0 }, { x: 3, y: 4 });
 * // Returns: 5
 */
export function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Calculate the midpoint between two points
 * 
 * @param a - First point
 * @param b - Second point
 * @returns The midpoint between a and b
 * 
 * @example
 * const mid = midpoint({ x: 0, y: 0 }, { x: 10, y: 10 });
 * // Returns: { x: 5, y: 5 }
 */
export function midpoint(a: Pt, b: Pt): Pt {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

