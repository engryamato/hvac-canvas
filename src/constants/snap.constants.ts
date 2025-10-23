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
 * Connection detection tolerance (pixels)
 * Endpoints within this distance are considered connected
 * Aligned with SNAP_THRESHOLD_ENDPOINT to keep snapping and connection detection consistent
 */
export const CONNECTION_TOLERANCE_PX = SNAP_THRESHOLD_ENDPOINT;

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
 * Primary blue color for high visibility (matches design system)
 */
export const SNAP_INDICATOR_COLOR = '#3B82F6'; // primary-500

/**
 * Snap indicator fill color
 * Semi-transparent primary blue for the circle fill
 */
export const SNAP_INDICATOR_FILL = 'rgba(59, 130, 246, 0.3)'; // primary-500 with 30% opacity

