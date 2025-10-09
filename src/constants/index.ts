/**
 * Constants barrel export
 * 
 * This file re-exports all constants for convenient importing.
 * Usage: import { ZOOM_FACTOR, SNAP_THRESHOLD_ENDPOINT } from '@/constants';
 */

// Canvas constants
export {
  ZOOM_FACTOR,
  MIN_ZOOM,
  MAX_ZOOM,
  MIN_LINE_LENGTH,
  SELECTION_HIGHLIGHT_WIDTH,
  HIT_TEST_MIN_TOLERANCE,
  HIT_TEST_WIDTH_FACTOR,
} from './canvas.constants';

// Snap constants
export {
  SNAP_THRESHOLD_ENDPOINT,
  SNAP_THRESHOLD_MIDPOINT,
  SNAP_THRESHOLD_LINE,
  SNAP_INDICATOR_RADIUS,
  SNAP_INDICATOR_COLOR,
  SNAP_INDICATOR_FILL,
} from './snap.constants';

// Scale constants
export {
  ARCHITECTURAL_SCALES,
  ENGINEERING_SCALES,
  METRIC_SCALES,
} from './scale.constants';

// Theme constants
export {
  TECH_BLUE_TOKENS,
  TECH_BLUE_CSS_VARS,
} from './theme.constants';

