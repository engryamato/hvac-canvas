/**
 * Canvas-related constants
 * 
 * This file contains constants for zoom, pan, and viewport behavior.
 */

/**
 * Zoom factor per step
 * Each zoom in/out operation multiplies/divides the scale by this factor
 * 1.1 = 10% change per step
 */
export const ZOOM_FACTOR = 1.1;

/**
 * Minimum zoom level (10%)
 * Prevents zooming out too far
 */
export const MIN_ZOOM = 0.1;

/**
 * Maximum zoom level (1000%)
 * Prevents zooming in too far
 */
export const MAX_ZOOM = 10.0;

/**
 * Minimum line length in pixels
 * Lines shorter than this will not be created
 */
export const MIN_LINE_LENGTH = 2;

/**
 * Additional width for selection highlight
 * Selected lines are drawn with this much extra width
 */
export const SELECTION_HIGHLIGHT_WIDTH = 8;

/**
 * Minimum hit test tolerance in pixels
 * Base tolerance for clicking on lines
 */
export const HIT_TEST_MIN_TOLERANCE = 6;

/**
 * Hit test width factor
 * Multiplied by line width to calculate hit test tolerance
 * tolerance = max(HIT_TEST_MIN_TOLERANCE, lineWidth * HIT_TEST_WIDTH_FACTOR)
 */
export const HIT_TEST_WIDTH_FACTOR = 1.5;

