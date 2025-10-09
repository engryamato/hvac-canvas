/**
 * Drawing Service
 * 
 * Encapsulates business logic for line creation, validation, and management.
 * This service sits between the UI layer (hooks/components) and the utility layer.
 */

import type { Line, Pt } from '../../types';
import { MIN_LINE_LENGTH } from '../../constants';
import { dist, getLineLength } from '../../utils/geometry';
import { uid } from '../../utils';

/**
 * Parameters for creating a new line
 */
export interface CreateLineParams {
  startPoint: Pt;
  endPoint: Pt;
  width: number;
  color: string;
}

/**
 * Result of line creation
 */
export interface CreateLineResult {
  success: boolean;
  line?: Line;
  error?: string;
}

/**
 * Create a new line with validation
 * 
 * Validates that the line meets minimum length requirements before creation.
 * 
 * @param params - Line creation parameters
 * @returns Result object with success status and line or error
 * 
 * @example
 * const result = createLine({
 *   startPoint: { x: 0, y: 0 },
 *   endPoint: { x: 100, y: 100 },
 *   width: 8,
 *   color: '#111827'
 * });
 * 
 * if (result.success && result.line) {
 *   // Add line to state
 * } else {
 *   console.error(result.error);
 * }
 */
export function createLine(params: CreateLineParams): CreateLineResult {
  const { startPoint, endPoint, width, color } = params;
  
  // Validate line length
  const length = dist(startPoint, endPoint);
  if (length <= MIN_LINE_LENGTH) {
    return {
      success: false,
      error: `Line too short. Minimum length is ${MIN_LINE_LENGTH} pixels.`
    };
  }
  
  // Validate width
  if (width < 1 || width > 60) {
    return {
      success: false,
      error: 'Line width must be between 1 and 60 pixels.'
    };
  }
  
  // Create the line
  const line: Line = {
    id: uid(),
    a: startPoint,
    b: endPoint,
    width,
    color
  };
  
  return {
    success: true,
    line
  };
}

/**
 * Validate if a line meets minimum requirements
 * 
 * @param line - Line to validate
 * @returns True if line is valid, false otherwise
 * 
 * @example
 * if (validateLine(line)) {
 *   // Line is valid
 * }
 */
export function validateLine(line: Line): boolean {
  const length = getLineLength(line);
  return length > MIN_LINE_LENGTH && line.width >= 1 && line.width <= 60;
}

/**
 * Calculate the length of a line in pixels
 * 
 * @param line - Line to measure
 * @returns Length in pixels
 * 
 * @example
 * const length = calculateLineLength(line);
 * console.log(`Line is ${length} pixels long`);
 */
export function calculateLineLength(line: Line): number {
  return getLineLength(line);
}

/**
 * Update the width of a line
 * 
 * @param line - Line to update
 * @param newWidth - New width value
 * @returns Updated line with new width
 * 
 * @example
 * const updatedLine = updateLineWidth(line, 12);
 */
export function updateLineWidth(line: Line, newWidth: number): Line {
  // Clamp width to valid range
  const clampedWidth = Math.max(1, Math.min(60, newWidth));
  
  return {
    ...line,
    width: clampedWidth
  };
}

/**
 * Update the color of a line
 * 
 * @param line - Line to update
 * @param newColor - New color value
 * @returns Updated line with new color
 * 
 * @example
 * const updatedLine = updateLineColor(line, '#FF0000');
 */
export function updateLineColor(line: Line, newColor: string): Line {
  return {
    ...line,
    color: newColor
  };
}

