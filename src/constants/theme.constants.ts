/**
 * Theme constants
 *
 * This file contains theme-related constants and utilities.
 * Now uses the centralized design token system.
 *
 * @see src/constants/design-tokens.ts - Complete design token definitions
 * @see src/constants/css-tokens.ts - CSS custom property generation
 */

import { DESIGN_TOKENS } from './design-tokens';
import { generateCSSTokens } from './css-tokens';

/**
 * Technical blue color tokens (legacy - use DESIGN_TOKENS instead)
 * @deprecated Use DESIGN_TOKENS.colors.primary instead
 */
export const TECH_BLUE_TOKENS = {
  300: DESIGN_TOKENS.colors.primary[300],
  500: DESIGN_TOKENS.colors.primary[500],
  600: DESIGN_TOKENS.colors.primary[600],
  700: DESIGN_TOKENS.colors.primary[700],
} as const;

/**
 * CSS custom properties for tech blue colors (legacy)
 * @deprecated Use CSSTokens component or generateCSSTokens() instead
 */
export const TECH_BLUE_CSS_VARS = generateCSSTokens();

// Re-export for convenience
export { DESIGN_TOKENS } from './design-tokens';
export { SEMANTIC_COLORS } from './design-tokens';
export { CSSTokens, generateCSSTokens } from './css-tokens';

