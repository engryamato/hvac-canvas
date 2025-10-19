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

// Theme constants (legacy)
export {
  TECH_BLUE_TOKENS,
  TECH_BLUE_CSS_VARS,
} from './theme.constants';

// Design tokens (new design system)
export {
  DESIGN_TOKENS,
  SEMANTIC_COLORS,
} from './design-tokens';

export type {
  ColorScale,
  ColorShade,
  FontSize,
  Spacing,
  Radius,
  Shadow,
  Transition,
} from './design-tokens';

// CSS tokens
export {
  CSSTokens,
  generateCSSTokens,
} from './css-tokens';

// Duct constants
export {
  DUCT_TYPES,
  STANDARD_WIDTHS,
  QUICK_WIDTH_CHIPS,
  MATERIALS,
  GAUGES,
  LAYERS,
  DEFAULT_DUCT_PROPERTIES,
} from './duct.constants';

// Modal constants
export {
  MODAL_WIDTH,
  MODAL_PADDING,
  MODAL_BORDER_RADIUS,
  EDGE_CLEARANCE,
  TAB_HEIGHT,
  TAB_GAP,
  HEADER_HEIGHT,
  FOOTER_HEIGHT,
  INPUT_HEIGHT,
  BUTTON_HEIGHT,
  CHIP_HEIGHT_MEDIUM,
  CHIP_HEIGHT_SMALL,
  CHIP_BORDER_RADIUS,
  DROPDOWN_MAX_HEIGHT,
  DROPDOWN_ITEM_HEIGHT,
  RESULT_ROW_HEIGHT,
  SECTION_GAP,
  ELEMENT_GAP,
  SMALL_GAP,
  PROPERTIES_TAB_HEIGHT_COLLAPSED,
  PROPERTIES_TAB_HEIGHT_EXPANDED,
  CALCULATIONS_TAB_HEIGHT,
  ADVANCED_TAB_HEIGHT,
  ANIMATION_OPEN,
  ANIMATION_CLOSE,
  ANIMATION_EXPAND,
  DROPDOWN_ANIMATION,
  TRANSITION_REPOSITION,
  NOTE_MAX_LENGTH,
  MAX_RECOMMENDED_VELOCITY,
} from './modal.constants';

// Calculation constants
export {
  WRIGHT_EQUATION,
  EQUIVALENT_DIAMETER,
  VELOCITY_PRESSURE_CONSTANT,
  CONVERSIONS,
  PRECISION,
} from './calculations.constants';
