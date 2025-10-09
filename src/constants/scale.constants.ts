/**
 * Scale system constants
 * 
 * This file contains predefined architectural, engineering, and metric scales.
 */

import type { Scale } from '../types';

/**
 * Architectural scales (imperial)
 * Common scales used in architectural drawings
 * Format: fraction of an inch = 1 foot
 */
export const ARCHITECTURAL_SCALES: Scale[] = [
  { type: 'architectural', pixelsPerInch: 1/192, displayName: '1/16" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/96, displayName: '1/8" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/48, displayName: '1/4" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/24, displayName: '1/2" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/16, displayName: '3/4" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/12, displayName: '1" = 1\'-0"', unit: 'imperial' },
];

/**
 * Engineering scales (imperial)
 * Common scales used in engineering drawings
 * Format: 1 inch = X feet
 */
export const ENGINEERING_SCALES: Scale[] = [
  { type: 'engineering', pixelsPerInch: 1/120, displayName: '1" = 10\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/240, displayName: '1" = 20\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/360, displayName: '1" = 30\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/480, displayName: '1" = 40\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/600, displayName: '1" = 50\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/720, displayName: '1" = 60\'', unit: 'imperial' },
];

/**
 * Metric scales
 * Common scales used in metric drawings
 * Format: 1:X (1 unit on drawing = X units in reality)
 */
export const METRIC_SCALES: Scale[] = [
  { type: 'metric', pixelsPerInch: 1, displayName: '1:1', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/5, displayName: '1:5', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/10, displayName: '1:10', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/20, displayName: '1:20', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/50, displayName: '1:50', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/100, displayName: '1:100', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/200, displayName: '1:200', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/500, displayName: '1:500', unit: 'metric' },
];

