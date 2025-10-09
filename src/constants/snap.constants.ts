/**
 * Snap system constants
 * 
 * This file contains constants for snap detection thresholds and visual indicators.
 */

/**
 * Snap threshold for endpoints (pixels)
 * Cursor must be within this distance to snap to a line's start or end point
 * Highest priority snap type
 */
export const SNAP_THRESHOLD_ENDPOINT = 20;

/**
 * Snap threshold for midpoints (pixels)
 * Cursor must be within this distance to snap to a line's midpoint
 * Medium priority snap type
 */
export const SNAP_THRESHOLD_MIDPOINT = 18;

/**
 * Snap threshold for line segments (pixels)
 * Cursor must be within this distance to snap to any point on a line
 * Lowest priority snap type
 */
export const SNAP_THRESHOLD_LINE = 15;

/**
 * Snap indicator circle radius (pixels)
 * Visual indicator shown when cursor is near a snap point
 */
export const SNAP_INDICATOR_RADIUS = 7;

/**
 * Snap indicator stroke color
 * Cyan color for high visibility
 */
export const SNAP_INDICATOR_COLOR = '#06B6D4';

/**
 * Snap indicator fill color
 * Semi-transparent cyan for the circle fill
 */
export const SNAP_INDICATOR_FILL = 'rgba(6, 182, 212, 0.3)';

