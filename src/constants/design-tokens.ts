/**
 * Design Tokens
 * 
 * Central source of truth for all design values.
 * These tokens are used to generate CSS custom properties and ensure
 * consistency across the application.
 * 
 * Based on the comprehensive design study (docs/DESIGN_STUDY.md)
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
export type Radius = keyof typeof DESIGN_TOKENS.radius;
export type Shadow = keyof typeof DESIGN_TOKENS.shadow;
export type Transition = keyof typeof DESIGN_TOKENS.transition;

// Semantic color mappings
export const SEMANTIC_COLORS = {
  text: {
    primary: DESIGN_TOKENS.colors.neutral[900],
    secondary: DESIGN_TOKENS.colors.neutral[600],
    tertiary: DESIGN_TOKENS.colors.neutral[500],
    disabled: DESIGN_TOKENS.colors.neutral[400],
  },
  background: {
    primary: '#FFFFFF',
    secondary: DESIGN_TOKENS.colors.neutral[50],
    tertiary: DESIGN_TOKENS.colors.neutral[100],
  },
  border: {
    default: DESIGN_TOKENS.colors.neutral[200],
    strong: DESIGN_TOKENS.colors.neutral[300],
  },
  button: {
    primary: {
      bg: DESIGN_TOKENS.colors.primary[600],
      bgHover: DESIGN_TOKENS.colors.primary[700],
      bgActive: DESIGN_TOKENS.colors.primary[800],
      text: '#FFFFFF',
    },
    secondary: {
      bg: '#FFFFFF',
      bgHover: DESIGN_TOKENS.colors.neutral[50],
      bgActive: DESIGN_TOKENS.colors.neutral[100],
      border: DESIGN_TOKENS.colors.neutral[300],
      text: DESIGN_TOKENS.colors.neutral[700],
    },
  },
} as const;

