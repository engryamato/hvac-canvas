/**
 * Scale conversion utilities
 * 
 * This file contains functions for converting between pixels and real-world
 * measurements using architectural/engineering scales.
 */

import type { Scale, ScaleUnit } from '../../types';

/**
 * Convert pixels to inches using the current scale
 * 
 * @param pixels - Number of pixels to convert
 * @param scale - Current scale configuration
 * @returns Length in inches
 * 
 * @example
 * const scale = { pixelsPerInch: 1/48, ... }; // 1/4" = 1'-0"
 * const inches = pixelsToInches(48, scale);
 * // Returns: 1 inch (which represents 1 foot at this scale)
 */
export function pixelsToInches(pixels: number, scale: Scale): number {
  return pixels / scale.pixelsPerInch;
}

/**
 * Format a length in inches to a human-readable string
 * 
 * For imperial units, formats as feet and inches (e.g., "5'-6\"")
 * For metric units, converts to centimeters or meters (e.g., "1.5 m")
 * 
 * @param inches - Length in inches
 * @param unit - Unit system to use for formatting
 * @returns Formatted length string
 * 
 * @example
 * // Imperial
 * formatLength(66, 'imperial');
 * // Returns: "5'-6\""
 * 
 * formatLength(6, 'imperial');
 * // Returns: "6\""
 * 
 * // Metric
 * formatLength(39.37, 'metric');
 * // Returns: "1.00 m"
 * 
 * formatLength(3.94, 'metric');
 * // Returns: "10.0 cm"
 */
export function formatLength(inches: number, unit: ScaleUnit): string {
  if (unit === 'imperial') {
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round((inches % 12) * 10) / 10;
    
    if (feet > 0) {
      if (remainingInches > 0) {
        return `${feet}'-${remainingInches}"`;
      }
      return `${feet}'-0"`;
    }
    return `${remainingInches}"`;
  } else {
    // Metric: convert inches to centimeters
    const cm = inches * 2.54;
    
    if (cm >= 100) {
      return `${(cm / 100).toFixed(2)} m`;
    }
    return `${cm.toFixed(1)} cm`;
  }
}

