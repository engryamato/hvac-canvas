/**
 * Line Manager Service
 *
 * Manages collections of lines with operations for adding, removing, and updating.
 * Provides immutable operations that return new arrays.
 */

import type { Line } from '../../types';
import { MIN_LINE_LENGTH } from '../../constants';
import { dist } from '../../utils/geometry';

/**
 * Add a line to a collection
 * 
 * @param lines - Current line collection
 * @param line - Line to add
 * @returns New array with line added
 * 
 * @example
 * const newLines = addLine(currentLines, newLine);
 * setLines(newLines);
 */
export function addLine(lines: Line[], line: Line): Line[] {
  return [...lines, line];
}

/**
 * Remove a line from a collection by ID
 * 
 * @param lines - Current line collection
 * @param lineId - ID of line to remove
 * @returns New array with line removed
 * 
 * @example
 * const newLines = removeLine(currentLines, 'line-123');
 * setLines(newLines);
 */
export function removeLine(lines: Line[], lineId: string): Line[] {
  return lines.filter(line => line.id !== lineId);
}

/**
 * Remove multiple lines from a collection by their IDs
 *
 * @param lines - Current line collection
 * @param lineIds - IDs of lines to remove
 * @returns New array without the specified lines
 *
 * @example
 * const newLines = removeLines(currentLines, ['line-123', 'line-456']);
 */
export function removeLines(lines: Line[], lineIds: string[]): Line[] {
  if (lineIds.length === 0) {
    return [...lines];
  }

  const idSet = new Set(lineIds);
  return lines.filter(line => !idSet.has(line.id));
}

/**
 * Update a line's width in a collection
 * 
 * @param lines - Current line collection
 * @param lineId - ID of line to update
 * @param widthUpdater - Function to calculate new width from current width
 * @returns New array with line width updated
 * 
 * @example
 * // Increase width by 1
 * const newLines = updateLineWidth(currentLines, 'line-123', w => w + 1);
 * 
 * // Set specific width
 * const newLines = updateLineWidth(currentLines, 'line-123', () => 12);
 */
export function updateLineWidth(
  lines: Line[],
  lineId: string,
  widthUpdater: (currentWidth: number) => number
): Line[] {
  return lines.map(line => {
    if (line.id !== lineId) return line;
    
    const newWidth = widthUpdater(line.width);
    // Clamp to valid range
    const clampedWidth = Math.max(1, Math.min(60, newWidth));
    
    return {
      ...line,
      width: clampedWidth
    };
  });
}

/**
 * Update a line's color in a collection
 * 
 * @param lines - Current line collection
 * @param lineId - ID of line to update
 * @param newColor - New color value
 * @returns New array with line color updated
 * 
 * @example
 * const newLines = updateLineColor(currentLines, 'line-123', '#FF0000');
 */
export function updateLineColor(
  lines: Line[],
  lineId: string,
  newColor: string
): Line[] {
  return lines.map(line =>
    line.id === lineId ? { ...line, color: newColor } : line
  );
}

/**
 * Find a line by ID
 * 
 * @param lines - Line collection to search
 * @param lineId - ID of line to find
 * @returns Line if found, undefined otherwise
 * 
 * @example
 * const line = findLineById(lines, 'line-123');
 * if (line) {
 *   console.log('Found line:', line);
 * }
 */
export function findLineById(lines: Line[], lineId: string): Line | undefined {
  return lines.find(line => line.id === lineId);
}

/**
 * Get all lines with a specific width
 * 
 * @param lines - Line collection to filter
 * @param width - Width to filter by
 * @returns Array of lines with matching width
 * 
 * @example
 * const eightInchLines = getLinesByWidth(lines, 8);
 */
export function getLinesByWidth(lines: Line[], width: number): Line[] {
  return lines.filter(line => line.width === width);
}

/**
 * Get all unique widths used in a line collection
 *
 * @param lines - Line collection
 * @returns Sorted array of unique widths
 *
 * @example
 * const widths = getUniqueWidths(lines);
 * // Returns: [4, 6, 8, 10, 12]
 */
export function getUniqueWidths(lines: Line[]): number[] {
  const widths = new Set(lines.map(line => line.width));
  return Array.from(widths).sort((a, b) => a - b);
}

/**
 * Update a line's length in a collection
 * Keeps endpoint 'a' fixed and adjusts endpoint 'b' to achieve the new length
 * while maintaining the line's angle/direction
 *
 * @param lines - Current line collection
 * @param lineId - ID of line to update
 * @param newLengthPixels - New length in pixels
 * @returns New array with line length updated
 *
 * @example
 * // Set line length to 100 pixels
 * const newLines = updateLineLength(currentLines, 'line-123', 100);
 */
export function updateLineLength(
  lines: Line[],
  lineId: string,
  newLengthPixels: number
): Line[] {
  return lines.map(line => {
    if (line.id !== lineId) return line;

    // Enforce minimum length
    const clampedLength = Math.max(MIN_LINE_LENGTH, newLengthPixels);

    // Calculate current line length and angle
    const currentLength = dist(line.a, line.b);

    // If current length is zero, can't determine direction
    // Keep the line as is
    if (currentLength === 0) return line;

    // Calculate angle from endpoint a to endpoint b
    const angle = Math.atan2(line.b.y - line.a.y, line.b.x - line.a.x);

    // Calculate new endpoint b position
    // Keep endpoint a fixed, move endpoint b
    const newB = {
      x: line.a.x + clampedLength * Math.cos(angle),
      y: line.a.y + clampedLength * Math.sin(angle)
    };

    return {
      ...line,
      b: newB
    };
  });
}
