/**
 * Scale system type definitions
 * 
 * This file contains types for the architectural/engineering scale system
 * that converts between pixels and real-world measurements.
 */

/**
 * Unit system for measurements
 * - 'imperial': Feet and inches (US standard)
 * - 'metric': Meters and centimeters
 */
export type ScaleUnit = 'imperial' | 'metric';

/**
 * Type of scale
 * - 'custom': User-defined scale
 * - 'architectural': Standard architectural scales (e.g., 1/4" = 1'-0")
 * - 'engineering': Standard engineering scales (e.g., 1" = 10')
 * - 'metric': Metric scales (e.g., 1:50)
 */
export type ScaleType = 'custom' | 'architectural' | 'engineering' | 'metric';

/**
 * Scale configuration
 * Defines how pixels on screen map to real-world measurements
 */
export type Scale = {
  /** Type of scale */
  type: ScaleType;
  /** Conversion factor: realInches = pixels / pixelsPerInch */
  pixelsPerInch: number;
  /** Human-readable scale name (e.g., "1/4\" = 1'-0\"" or "1:50") */
  displayName: string;
  /** Unit system used by this scale */
  unit: ScaleUnit;
};

/**
 * Line summary row for sidebar display
 * Groups lines by width and shows aggregate statistics
 */
export type LineSummaryRow = {
  /** Width in pixels */
  width: number;
  /** Formatted width display (e.g., "8\"") */
  widthDisplay: string;
  /** Number of lines with this width */
  count: number;
  /** Total length of all lines with this width (in inches) */
  totalLength: number;
  /** Formatted total length (e.g., "28'-6\"") */
  totalLengthDisplay: string;
  /** Array of line IDs in this group (stored, not displayed) */
  lineIds: string[];
};

