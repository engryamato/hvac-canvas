# HVAC Canvas - Design System Implementation Guide

**Date:** 2025-10-09  
**Version:** 1.0  
**Related:** [DESIGN_STUDY.md](./DESIGN_STUDY.md)

---

## Quick Start

This guide provides step-by-step instructions for implementing the design system recommendations from the Design Study.

---

## Phase 1: Design Tokens Foundation

### Step 1.1: Create Design Tokens File

Create `src/constants/design-tokens.ts`:

```typescript
/**
 * Design Tokens
 * 
 * Central source of truth for all design values.
 * These tokens are used to generate CSS custom properties.
 */

export const DESIGN_TOKENS = {
  // Color Palette
  colors: {
    // Primary (Technical Blue)
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    
    // Neutral (Cool Gray - Slate)
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    
    // State Colors
    success: {
      50: '#F0FDF4',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
    },
    
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
    },
    
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
    },
    
    info: {
      50: '#ECFEFF',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", Consolas, "Courier New", monospace',
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      md: '1.125rem',   // 18px
      lg: '1.25rem',    // 20px
      xl: '1.5rem',     // 24px
      '2xl': '1.875rem', // 30px
      '3xl': '2.25rem',  // 36px
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing (8px base grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    sm: '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
    '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
  },
  
  // Transitions
  transition: {
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Component Sizes
  size: {
    button: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
    },
    input: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
    },
    icon: {
      xs: '1rem',      // 16px
      sm: '1.25rem',   // 20px
      md: '1.5rem',    // 24px
      lg: '2rem',      // 32px
      xl: '2.5rem',    // 40px
    },
    fab: '3.5rem',     // 56px
    sidebar: '20rem',  // 320px
    sidebarToggle: '1.5rem', // 24px
    bottombar: '3.75rem',    // 60px
  },
} as const;

// Type exports for TypeScript
export type ColorScale = keyof typeof DESIGN_TOKENS.colors;
export type ColorShade = keyof typeof DESIGN_TOKENS.colors.primary;
export type FontSize = keyof typeof DESIGN_TOKENS.typography.fontSize;
export type Spacing = keyof typeof DESIGN_TOKENS.spacing;
```

### Step 1.2: Generate CSS Custom Properties

Create `src/constants/css-tokens.ts`:

```typescript
/**
 * CSS Custom Properties Generator
 * 
 * Generates CSS custom properties from design tokens.
 */

import { DESIGN_TOKENS } from './design-tokens';

/**
 * Generate CSS custom properties string
 */
export function generateCSSTokens(): string {
  const { colors, typography, spacing, radius, shadow, transition, size } = DESIGN_TOKENS;
  
  const cssVars: string[] = [':root {'];
  
  // Colors
  Object.entries(colors).forEach(([scale, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      cssVars.push(`  --color-${scale}-${shade}: ${value};`);
    });
  });
  
  // Typography
  Object.entries(typography.fontFamily).forEach(([name, value]) => {
    cssVars.push(`  --font-family-${name}: ${value};`);
  });
  
  Object.entries(typography.fontSize).forEach(([name, value]) => {
    cssVars.push(`  --font-size-${name}: ${value};`);
  });
  
  Object.entries(typography.fontWeight).forEach(([name, value]) => {
    cssVars.push(`  --font-weight-${name}: ${value};`);
  });
  
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
  
  // Sizes
  Object.entries(size).forEach(([component, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([variant, val]) => {
        cssVars.push(`  --size-${component}-${variant}: ${val};`);
      });
    } else {
      cssVars.push(`  --size-${component}: ${value};`);
    }
  });
  
  cssVars.push('}');
  
  return cssVars.join('\n');
}

/**
 * CSS Tokens Component
 * Injects design tokens as CSS custom properties
 */
export function CSSTokens(): JSX.Element {
  return <style>{generateCSSTokens()}</style>;
}
```

### Step 1.3: Update Theme Constants

Update `src/constants/theme.constants.ts`:

```typescript
/**
 * Theme constants
 * 
 * This file contains theme-related constants and utilities.
 * Now uses the centralized design token system.
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
 * @deprecated Use CSSTokens component instead
 */
export const TECH_BLUE_CSS_VARS = generateCSSTokens();

// Re-export for convenience
export { DESIGN_TOKENS } from './design-tokens';
export { CSSTokens, generateCSSTokens } from './css-tokens';
```

---

## Phase 2: Typography Implementation

### Step 2.1: Add JetBrains Mono Font

Update `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HVAC Canvas</title>
    
    <!-- Preload fonts for better performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Inter (already included via CSS) -->
    <!-- JetBrains Mono for technical/data display -->
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 2.2: Update Base Typography

Create `src/styles/typography.css`:

```css
/**
 * Typography Styles
 * 
 * Base typography and text utilities using design tokens.
 */

/* Base font setup */
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-900);
}

/* Heading styles */
h1, .h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-900);
}

h2, .h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-900);
}

h3, .h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-800);
}

h4, .h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-800);
}

h5, .h5 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-700);
}

h6, .h6 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-700);
}

/* Text utilities */
.text-mono {
  font-family: var(--font-family-mono);
}

.text-tabular {
  font-variant-numeric: tabular-nums;
}

/* Font sizes */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-md { font-size: var(--font-size-md); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }

/* Font weights */
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }
```

---

## Implementation Checklist

### Phase 1: Foundation ✓
- [ ] Create `design-tokens.ts`
- [ ] Create `css-tokens.ts`
- [ ] Update `theme.constants.ts`
- [ ] Test token generation
- [ ] Verify no visual changes

### Phase 2: Typography
- [ ] Add JetBrains Mono to `index.html`
- [ ] Create `typography.css`
- [ ] Update `main.tsx` to import typography
- [ ] Apply monospace to numeric displays
- [ ] Test font loading

### Phase 3: Colors (Next Document)
- [ ] Update color classes in `styles.css`
- [ ] Update component colors
- [ ] Verify contrast ratios
- [ ] Test all states

### Phase 4: Spacing & Components (Next Document)
- [ ] Update spacing utilities
- [ ] Update component styles
- [ ] Test responsive behavior
- [ ] Visual regression testing

---

**Next:** See [DESIGN_STUDY.md](./DESIGN_STUDY.md) for complete design specifications.


