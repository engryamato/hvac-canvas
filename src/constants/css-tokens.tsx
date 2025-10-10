/**
 * CSS Custom Properties Generator
 *
 * Generates CSS custom properties from design tokens.
 * This enables runtime token usage throughout the application.
 */

import React from 'react';
import { DESIGN_TOKENS, SEMANTIC_COLORS } from './design-tokens';

/**
 * Generate CSS custom properties string
 */
export function generateCSSTokens(): string {
  const { colors, typography, spacing, radius, shadow, transition, size } = DESIGN_TOKENS;
  
  const cssVars: string[] = [':root {'];
  
  // Colors - Primary
  Object.entries(colors.primary).forEach(([shade, value]) => {
    cssVars.push(`  --color-primary-${shade}: ${value};`);
  });
  
  // Colors - Neutral
  Object.entries(colors.neutral).forEach(([shade, value]) => {
    cssVars.push(`  --color-neutral-${shade}: ${value};`);
  });
  
  // Colors - Success
  Object.entries(colors.success).forEach(([shade, value]) => {
    cssVars.push(`  --color-success-${shade}: ${value};`);
  });
  
  // Colors - Warning
  Object.entries(colors.warning).forEach(([shade, value]) => {
    cssVars.push(`  --color-warning-${shade}: ${value};`);
  });
  
  // Colors - Error
  Object.entries(colors.error).forEach(([shade, value]) => {
    cssVars.push(`  --color-error-${shade}: ${value};`);
  });
  
  // Colors - Info
  Object.entries(colors.info).forEach(([shade, value]) => {
    cssVars.push(`  --color-info-${shade}: ${value};`);
  });
  
  // Semantic Colors - Text
  cssVars.push(`  --text-primary: ${SEMANTIC_COLORS.text.primary};`);
  cssVars.push(`  --text-secondary: ${SEMANTIC_COLORS.text.secondary};`);
  cssVars.push(`  --text-tertiary: ${SEMANTIC_COLORS.text.tertiary};`);
  cssVars.push(`  --text-disabled: ${SEMANTIC_COLORS.text.disabled};`);
  
  // Semantic Colors - Background
  cssVars.push(`  --bg-primary: ${SEMANTIC_COLORS.background.primary};`);
  cssVars.push(`  --bg-secondary: ${SEMANTIC_COLORS.background.secondary};`);
  cssVars.push(`  --bg-tertiary: ${SEMANTIC_COLORS.background.tertiary};`);
  
  // Semantic Colors - Border
  cssVars.push(`  --border-default: ${SEMANTIC_COLORS.border.default};`);
  cssVars.push(`  --border-strong: ${SEMANTIC_COLORS.border.strong};`);
  
  // Typography - Font Family
  Object.entries(typography.fontFamily).forEach(([name, value]) => {
    cssVars.push(`  --font-family-${name}: ${value};`);
  });
  
  // Typography - Font Size
  Object.entries(typography.fontSize).forEach(([name, value]) => {
    cssVars.push(`  --font-size-${name}: ${value};`);
  });
  
  // Typography - Font Weight
  Object.entries(typography.fontWeight).forEach(([name, value]) => {
    cssVars.push(`  --font-weight-${name}: ${value};`);
  });
  
  // Typography - Line Height
  Object.entries(typography.lineHeight).forEach(([name, value]) => {
    cssVars.push(`  --line-height-${name}: ${value};`);
  });
  
  // Spacing
  Object.entries(spacing).forEach(([name, value]) => {
    cssVars.push(`  --space-${name}: ${value};`);
  });
  
  // Border Radius
  Object.entries(radius).forEach(([name, value]) => {
    cssVars.push(`  --radius-${name}: ${value};`);
  });
  
  // Shadows
  Object.entries(shadow).forEach(([name, value]) => {
    cssVars.push(`  --shadow-${name}: ${value};`);
  });
  
  // Transitions
  Object.entries(transition).forEach(([name, value]) => {
    cssVars.push(`  --transition-${name}: ${value};`);
  });
  
  // Sizes - Buttons
  Object.entries(size.button).forEach(([variant, value]) => {
    cssVars.push(`  --size-button-${variant}: ${value};`);
  });
  
  // Sizes - Inputs
  Object.entries(size.input).forEach(([variant, value]) => {
    cssVars.push(`  --size-input-${variant}: ${value};`);
  });
  
  // Sizes - Icons
  Object.entries(size.icon).forEach(([variant, value]) => {
    cssVars.push(`  --size-icon-${variant}: ${value};`);
  });
  
  // Sizes - Components
  cssVars.push(`  --size-fab: ${size.fab};`);
  cssVars.push(`  --size-sidebar: ${size.sidebar};`);
  cssVars.push(`  --size-sidebar-toggle: ${size.sidebarToggle};`);
  cssVars.push(`  --height-bottombar: ${size.bottombar};`);
  
  // Legacy tech-blue tokens for backward compatibility
  cssVars.push(`  --tech-blue-300: ${colors.primary[300]};`);
  cssVars.push(`  --tech-blue-500: ${colors.primary[500]};`);
  cssVars.push(`  --tech-blue-600: ${colors.primary[600]};`);
  cssVars.push(`  --tech-blue-700: ${colors.primary[700]};`);
  
  cssVars.push('}');
  
  return cssVars.join('\n');
}

/**
 * CSS Tokens Component
 * Injects design tokens as CSS custom properties
 * 
 * @example
 * import { CSSTokens } from './constants/css-tokens';
 * 
 * function App() {
 *   return (
 *     <>
 *       <CSSTokens />
 *       <YourApp />
 *     </>
 *   );
 * }
 */
export function CSSTokens(): JSX.Element {
  return <style>{generateCSSTokens()}</style>;
}

