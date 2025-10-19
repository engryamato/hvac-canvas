/**
 * Hit Test Service
 *
 * Provides reusable functions for hit-testing the line collection.
 * Encapsulates geometric calculations and tolerance rules used by the canvas.
 */

import type { Line, Pt } from '../../types';
import {
  HIT_TEST_MIN_TOLERANCE,
  HIT_TEST_WIDTH_FACTOR,
} from '../../constants';
import { dist, getDistancePointToSegment } from '../../utils/geometry';

/**
 * Hit test the collection to find the closest line to a point.
 *
 * @param lines - All lines in the drawing
 * @param point - Pointer position in canvas coordinates
 * @returns The ID of the closest line within tolerance, or null if none found
 */
export function findLineHit(lines: Line[], point: Pt): string | null {
  let best: { id: string; distance: number } | null = null;

  for (const line of lines) {
    const tolerance = Math.max(
      HIT_TEST_MIN_TOLERANCE,
      line.width / HIT_TEST_WIDTH_FACTOR
    );

    const distance = getDistancePointToSegment(point, line.a, line.b);

    if (distance <= tolerance) {
      if (!best || distance < best.distance) {
        best = { id: line.id, distance };
      }
    }
  }

  return best?.id ?? null;
}

/**
 * Determine if a point is near one of a line's endpoints.
 *
 * @param line - Line to test
 * @param point - Pointer position in canvas coordinates
 * @param threshold - Distance threshold for endpoint detection
 * @returns 'a', 'b', or null depending on which endpoint is closest within threshold
 */
export function findEndpointHit(
  line: Line,
  point: Pt,
  threshold = 15
): 'a' | 'b' | null {
  const distanceToA = dist(point, line.a);
  const distanceToB = dist(point, line.b);

  if (distanceToA <= threshold && distanceToA <= distanceToB) {
    return 'a';
  }

  if (distanceToB <= threshold) {
    return 'b';
  }

  return null;
}
