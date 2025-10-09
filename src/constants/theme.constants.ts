/**
 * Theme constants
 * 
 * This file contains color tokens and theme-related constants.
 */

/**
 * Technical blue color tokens
 * Used for primary UI elements like the draw button
 */
export const TECH_BLUE_TOKENS = {
  300: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
} as const;

/**
 * CSS custom properties for tech blue colors
 * Can be injected into the document head for global use
 */
export const TECH_BLUE_CSS_VARS = `
  :root {
    --tech-blue-300: ${TECH_BLUE_TOKENS[300]};
    --tech-blue-500: ${TECH_BLUE_TOKENS[500]};
    --tech-blue-600: ${TECH_BLUE_TOKENS[600]};
    --tech-blue-700: ${TECH_BLUE_TOKENS[700]};
  }
`;

