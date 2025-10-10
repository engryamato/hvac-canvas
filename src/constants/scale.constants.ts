/**
 * Scale system constants
 *
 * This file contains predefined architectural, engineering, and metric scales.
 *
 * Base conversion: 64 pixels = 1 inch on screen
 * All pixelsPerInch values are calculated relative to this base.
 */

import type { Scale } from '../types';

/**
 * Base conversion factor: pixels per inch on screen
 * This is the fundamental conversion between screen pixels and real-world inches
 */
const BASE_PIXELS_PER_INCH = 64;

/**
 * Architectural scales (imperial)
 * Common scales used in architectural drawings
 * Format: fraction of an inch = 1 foot
 *
 * Example: 1/4" = 1'-0" means:
 * - 1/4 inch on the drawing represents 1 foot (12 inches) in reality
 * - Scale ratio: 1:48 (1/4 inch : 12 inches)
 * - pixelsPerInch = BASE_PIXELS_PER_INCH / 192
 *   (because 1/4" on drawing = 12" in reality, so 1" on drawing = 48" in reality)
 */
export const ARCHITECTURAL_SCALES: Scale[] = [
  { type: 'architectural', pixelsPerInch: BASE_PIXELS_PER_INCH / 192, displayName: '1/16" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: BASE_PIXELS_PER_INCH / 96, displayName: '1/8" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: BASE_PIXELS_PER_INCH / 48, displayName: '1/4" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: BASE_PIXELS_PER_INCH / 24, displayName: '1/2" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: BASE_PIXELS_PER_INCH / 16, displayName: '3/4" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: BASE_PIXELS_PER_INCH / 12, displayName: '1" = 1\'-0"', unit: 'imperial' },
];

/**
 * Engineering scales (imperial)
 * Common scales used in engineering drawings
 * Format: 1 inch = X feet
 *
 * Example: 1" = 10' means:
 * - 1 inch on the drawing represents 10 feet (120 inches) in reality
 * - Scale ratio: 1:120
 * - pixelsPerInch = BASE_PIXELS_PER_INCH / 120
 */
export const ENGINEERING_SCALES: Scale[] = [
  { type: 'engineering', pixelsPerInch: BASE_PIXELS_PER_INCH / 120, displayName: '1" = 10\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: BASE_PIXELS_PER_INCH / 240, displayName: '1" = 20\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: BASE_PIXELS_PER_INCH / 360, displayName: '1" = 30\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: BASE_PIXELS_PER_INCH / 480, displayName: '1" = 40\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: BASE_PIXELS_PER_INCH / 600, displayName: '1" = 50\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: BASE_PIXELS_PER_INCH / 720, displayName: '1" = 60\'', unit: 'imperial' },
];

/**
 * Metric scales
 * Common scales used in metric drawings
 * Format: 1:X (1 unit on drawing = X units in reality)
 *
 * Example: 1:50 means:
 * - 1 inch on the drawing represents 50 inches in reality
 * - Scale ratio: 1:50
 * - pixelsPerInch = BASE_PIXELS_PER_INCH / 50
 */
export const METRIC_SCALES: Scale[] = [
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 1, displayName: '1:1', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 5, displayName: '1:5', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 10, displayName: '1:10', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 20, displayName: '1:20', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 50, displayName: '1:50', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 100, displayName: '1:100', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 200, displayName: '1:200', unit: 'metric' },
  { type: 'metric', pixelsPerInch: BASE_PIXELS_PER_INCH / 500, displayName: '1:500', unit: 'metric' },
];

