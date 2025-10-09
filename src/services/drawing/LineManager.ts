/**
 * Line Manager Service
 * 
 * Manages collections of lines with operations for adding, removing, and updating.
 * Provides immutable operations that return new arrays.
 */

import type { Line } from '../../types';

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

