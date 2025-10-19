/**
 * Line geometry utilities
 * 
 * This file contains utility functions for working with line segments.
 */

import type { Pt, Line } from '../../types';
import { dist } from './points';

/**
 * Find the closest point on a line segment to a given point
 * 
 * This function projects the point onto the line segment and clamps
 * the result to the segment endpoints.
 * 
 * @param p - The point to find the closest point to
 * @param a - Start point of the line segment
 * @param b - End point of the line segment
 * @returns The closest point on the segment to p
 * 
 * @example
 * const closest = getClosestPointOnSegment(
 *   { x: 5, y: 5 },
 *   { x: 0, y: 0 },
 *   { x: 10, y: 0 }
 * );
 * // Returns: { x: 5, y: 0 }
 */
export function getClosestPointOnSegment(p: Pt, a: Pt, b: Pt): Pt {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;
  
  // If segment is a point, return that point
  if (ab2 === 0) return a;
  
  // Calculate projection parameter t
  let t = (apx * abx + apy * aby) / ab2;
  
  // Clamp t to [0, 1] to stay within segment
  t = Math.max(0, Math.min(1, t));
  
  return {
    x: a.x + t * abx,
    y: a.y + t * aby
  };
}

/**
 * Calculate the length of a line
 * 
 * @param line - The line to measure
 * @returns Length of the line in pixels
 * 
 * @example
 * const length = getLineLength({
 *   id: '1',
 *   a: { x: 0, y: 0 },
 *   b: { x: 3, y: 4 },
 *   width: 8,
 *   color: '#000'
 * });
 * // Returns: 5
 */
export function getLineLength(line: Line): number {
  return dist(line.a, line.b);
}

/**
 * Calculate the shortest distance from a point to a line segment.
 *
 * Uses vector projection to find the closest point on the segment and then
 * measures the distance between the point and that closest point.
 *
 * @param p - Arbitrary point
 * @param a - Start point of the line segment
 * @param b - End point of the line segment
 * @returns The perpendicular distance from point p to segment AB
 *
 * @example
 * const distance = getDistancePointToSegment(
 *   { x: 5, y: 5 },
 *   { x: 0, y: 0 },
 *   { x: 10, y: 0 }
 * );
 * // Returns: 5
 */
export function getDistancePointToSegment(p: Pt, a: Pt, b: Pt): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;

  if (ab2 === 0) {
    return Math.hypot(apx, apy);
  }

  let t = (apx * abx + apy * aby) / ab2;
  t = Math.max(0, Math.min(1, t));

  const cx = a.x + t * abx;
  const cy = a.y + t * aby;

  return Math.hypot(p.x - cx, p.y - cy);
}
