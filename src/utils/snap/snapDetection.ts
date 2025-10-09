/**
 * Snap detection utilities
 * 
 * This file contains functions for detecting snap targets when drawing lines.
 * The snap system helps users connect lines precisely by snapping to endpoints,
 * midpoints, and points along existing lines.
 */

import type { Pt, Line, SnapTarget } from '../../types';
import {
  SNAP_THRESHOLD_ENDPOINT,
  SNAP_THRESHOLD_MIDPOINT,
  SNAP_THRESHOLD_LINE,
} from '../../constants';
import { dist } from '../geometry/points';
import { midpoint } from '../geometry/points';
import { getClosestPointOnSegment } from '../geometry/lines';

/**
 * Find the best snap target for a cursor position
 * 
 * Checks all lines for potential snap points and returns the closest one.
 * Snap priority: endpoint (20px) > midpoint (18px) > line (15px)
 * 
 * @param cursor - Current cursor position in canvas coordinates
 * @param lines - Array of lines to check for snap targets
 * @param excludeLineId - Optional line ID to exclude (e.g., the line being drawn)
 * @returns The closest snap target, or null if none found
 * 
 * @example
 * const snapTarget = findSnapTarget(
 *   cursorPos,
 *   allLines,
 *   currentLineId
 * );
 * if (snapTarget) {
 *   console.log(`Snapping to ${snapTarget.type} of line ${snapTarget.lineId}`);
 * }
 */
export function findSnapTarget(
  cursor: Pt,
  lines: Line[],
  excludeLineId?: string
): SnapTarget | null {
  const candidates: SnapTarget[] = [];

  for (const line of lines) {
    // Skip the excluded line (e.g., the line being drawn)
    if (line.id === excludeLineId) continue;

    // Check endpoint A (20px threshold)
    const distToA = dist(cursor, line.a);
    if (distToA <= SNAP_THRESHOLD_ENDPOINT) {
      candidates.push({
        lineId: line.id,
        point: line.a,
        type: 'endpoint',
        distance: distToA
      });
    }

    // Check endpoint B (20px threshold)
    const distToB = dist(cursor, line.b);
    if (distToB <= SNAP_THRESHOLD_ENDPOINT) {
      candidates.push({
        lineId: line.id,
        point: line.b,
        type: 'endpoint',
        distance: distToB
      });
    }

    // Check midpoint (18px threshold)
    const mid = midpoint(line.a, line.b);
    const distToMid = dist(cursor, mid);
    if (distToMid <= SNAP_THRESHOLD_MIDPOINT) {
      candidates.push({
        lineId: line.id,
        point: mid,
        type: 'midpoint',
        distance: distToMid
      });
    }

    // Check any point on line (15px threshold)
    const closestPoint = getClosestPointOnSegment(cursor, line.a, line.b);
    const distToLine = dist(cursor, closestPoint);
    if (distToLine <= SNAP_THRESHOLD_LINE) {
      candidates.push({
        lineId: line.id,
        point: closestPoint,
        type: 'line',
        distance: distToLine
      });
    }
  }

  // Return closest candidate overall
  if (candidates.length === 0) return null;
  return candidates.reduce((closest, current) =>
    current.distance < closest.distance ? current : closest
  );
}

/**
 * Resolve the final point to use, applying snap if available
 * 
 * If a snap target is provided, returns the snap point.
 * Otherwise, returns the raw cursor position.
 * 
 * @param rawPoint - The raw cursor position
 * @param snapTarget - The snap target (if any)
 * @returns The final point (snapped or raw)
 * 
 * @example
 * const finalPoint = resolveSnapPoint(cursorPos, snapTarget);
 * // If snapTarget exists, returns snapTarget.point
 * // Otherwise, returns cursorPos
 */
export function resolveSnapPoint(rawPoint: Pt, snapTarget: SnapTarget | null): Pt {
  return snapTarget ? snapTarget.point : rawPoint;
}

