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
  
  // Shadows - Enhanced with colored shadows for depth
  shadow: {
    xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    sm: '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px -1px rgba(15, 23, 42, 0.1)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
    '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
    'primary-sm': '0 2px 8px -2px rgba(37, 99, 235, 0.3)',
    'primary-md': '0 4px 16px -4px rgba(37, 99, 235, 0.4)',
    'primary-lg': '0 8px 24px -6px rgba(37, 99, 235, 0.5)',
    'glow-sm': '0 0 12px rgba(59, 130, 246, 0.3)',
    'glow-md': '0 0 20px rgba(59, 130, 246, 0.4)',
    'glow-lg': '0 0 32px rgba(59, 130, 246, 0.5)',
    'inner-sm': 'inset 0 1px 2px rgba(15, 23, 42, 0.05)',
    'inner-md': 'inset 0 2px 4px rgba(15, 23, 42, 0.08)',
  },
  
  gradient: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    'primary-hover': 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    accent: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
  },
  
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '600ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  animation: {
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    shimmer: 'shimmer 2s linear infinite',
    'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    'slide-in-right': 'slideInRight 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    'scale-in': 'scaleIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
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

/**
 * Modal-Specific Design Tokens
 *
 * Design tokens specifically for the Line Properties Modal.
 * All values match wireframe specifications exactly.
 *
 * @example
 * ```tsx
 * import { MODAL_TOKENS } from '@/constants/design-tokens';
 *
 * const modalStyle = {
 *   width: `${MODAL_TOKENS.dimensions.MODAL_WIDTH}px`,
 *   backgroundColor: MODAL_TOKENS.colors.MODAL_BG,
 * };
 * ```
 */
export const MODAL_TOKENS = {
  /**
   * Modal Color Tokens
   * Exact color values from wireframe specifications
   */
  colors: {
    // Base colors
    MODAL_BG: '#ffffff',
    MODAL_BORDER: '#e5e7eb',

    // Duct type colors
    SUPPLY_BLUE: '#2563eb',
    RETURN_RED: '#dc2626',

    // Tab colors
    ACTIVE_TAB_BG: '#2563eb',
    ACTIVE_TAB_TEXT: '#ffffff',
    INACTIVE_TAB_TEXT: '#6b7280',
    INACTIVE_TAB_HOVER_BG: '#f3f4f6',

    // Status colors
    WARNING_BG: '#fef3c7',
    WARNING_BORDER: '#fbbf24',
    WARNING_TEXT: '#92400e',
    INFO_BG: '#dbeafe',
    INFO_BORDER: '#3b82f6',
    SUCCESS_GREEN: '#10b981',
    ERROR_RED: '#ef4444',

    // Neutral grays (Tailwind neutral palette)
    GRAY_50: '#f9fafb',
    GRAY_100: '#f3f4f6',
    GRAY_200: '#e5e7eb',
    GRAY_300: '#d1d5db',
    GRAY_400: '#9ca3af',
    GRAY_500: '#6b7280',
    GRAY_600: '#4b5563',
    GRAY_700: '#374151',
    GRAY_800: '#1f2937',
    GRAY_900: '#111827',

    // Focus colors
    FOCUS_RING: '#3b82f6',
    FOCUS_RING_OFFSET: '#ffffff',
  },

  /**
   * Modal Dimension Tokens
   * All spacing, sizing, and layout dimensions in pixels
   */
  dimensions: {
    // Modal container
    MODAL_WIDTH: 220,
    MODAL_PADDING: 16,
    MODAL_BORDER_RADIUS: 8,
    EDGE_CLEARANCE: 16,

    // Component heights
    TAB_HEIGHT: 36,
    HEADER_HEIGHT: 32,
    FOOTER_HEIGHT: 40,
    INPUT_HEIGHT: 32,
    BUTTON_HEIGHT: 40,
    CHIP_HEIGHT_MEDIUM: 28,
    CHIP_HEIGHT_SMALL: 24,

    // Border radius
    CHIP_BORDER_RADIUS: 14,
    INPUT_BORDER_RADIUS: 4,
    BUTTON_BORDER_RADIUS: 6,
    DROPDOWN_BORDER_RADIUS: 4,

    // Dropdown
    DROPDOWN_MAX_HEIGHT: 224,
    DROPDOWN_ITEM_HEIGHT: 32,

    // Spacing
    SECTION_GAP: 16,
    ELEMENT_GAP: 12,
    SMALL_GAP: 4,
    TAB_GAP: 2,

    // Icon sizes
    ICON_SIZE_SMALL: 12,
    ICON_SIZE_MEDIUM: 14,
    ICON_SIZE_LARGE: 16,

    // Color indicator
    COLOR_INDICATOR_SIZE: 12,
  },

  /**
   * Modal Typography Tokens
   * Font sizes, weights, and line heights
   */
  typography: {
    // Title (modal header)
    TITLE_SIZE: 14,
    TITLE_WEIGHT: 600, // semibold
    TITLE_LINE_HEIGHT: 1.5,

    // Tabs
    TAB_SIZE: 13,
    TAB_WEIGHT: 500, // medium
    TAB_LINE_HEIGHT: 1.5,

    // Labels
    LABEL_SIZE: 12,
    LABEL_WEIGHT: 500, // medium
    LABEL_LINE_HEIGHT: 1.5,

    // Input text
    INPUT_SIZE: 14,
    INPUT_WEIGHT: 400, // regular
    INPUT_LINE_HEIGHT: 1.5,

    // Helper text
    HELPER_SIZE: 11,
    HELPER_WEIGHT: 400, // regular
    HELPER_LINE_HEIGHT: 1.5,

    // Metadata
    METADATA_SIZE: 11,
    METADATA_WEIGHT: 400, // regular
    METADATA_LINE_HEIGHT: 1.5,

    // Chips
    CHIP_SIZE: 12,
    CHIP_WEIGHT: 500, // medium
    CHIP_LINE_HEIGHT: 1.5,

    // Buttons
    BUTTON_SIZE: 14,
    BUTTON_WEIGHT: 600, // semibold
    BUTTON_LINE_HEIGHT: 1.5,
  },

  /**
   * Modal Shadow Tokens
   * Box shadow definitions for modal and dropdown
   */
  shadows: {
    // Modal shadow (elevation)
    MODAL_SHADOW: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

    // Dropdown shadow (higher elevation)
    DROPDOWN_SHADOW: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

    // Focus ring shadow
    FOCUS_RING_SHADOW: '0 0 0 2px rgba(59, 130, 246, 0.5)',
  },

  /**
   * Modal Animation Tokens
   * Animation durations and timing functions
   */
  animations: {
    // Durations (in milliseconds)
    DURATION_OPEN: 200,
    DURATION_CLOSE: 150,
    DURATION_EXPAND: 300,
    DURATION_DROPDOWN: 150,
    DURATION_TRANSITION: 200,

    // Timing functions
    TIMING_EASE_IN_OUT: 'ease-in-out',
    TIMING_EASE_OUT: 'ease-out',
    TIMING_EASE_IN: 'ease-in',
  },
} as const;

/**
 * TypeScript types for modal tokens
 */
export type ModalTokens = typeof MODAL_TOKENS;



/**
 * Neumorphism Design Tokens
 *
 * Neumorphic (soft UI) design system for creating depth through dual shadows.
 * Neumorphism uses a unified background color with light and dark shadows to create
 * the illusion of raised or inset elements.
 *
 * Design Principles:
 * - Unified background: #E0E5EC (light gray-blue)
 * - Dual shadows: light (top-left) + dark (bottom-right)
 * - Raised elements: light shadow top-left, dark shadow bottom-right
 * - Inset elements: inverted shadows (dark top-left, light bottom-right)
 * - No borders, no transparency, no blur
 *
 * Performance Benefits:
 * - No backdrop-filter (GPU-intensive)
 * - Solid backgrounds (better rendering)
 * - Simple box-shadow (hardware accelerated)
 *
 * @example
 * ```tsx
 * import { NEUMORPHISM_TOKENS } from '@/constants/design-tokens';
 *
 * const buttonStyle = {
 *   background: NEUMORPHISM_TOKENS.background,
 *   boxShadow: NEUMORPHISM_TOKENS.shadows.raised.medium,
 *   borderRadius: NEUMORPHISM_TOKENS.borderRadius.medium,
 * };
 * ```
 */
export const NEUMORPHISM_TOKENS = {
  /**
   * Base background color
   * All neumorphic elements use this unified background
   */
  background: '#E0E5EC',

  /**
   * Shadow colors
   * Light shadow (top-left) and dark shadow (bottom-right)
   */
  shadowColors: {
    light: 'rgba(255, 255, 255, 0.5)',
    dark: 'rgba(163, 177, 198, 0.6)',
  },

  /**
   * Raised element shadows
   * Creates the illusion of elements rising from the surface
   * Format: dark shadow (bottom-right), light shadow (top-left)
   */
  shadows: {
    raised: {
      small: '4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.5)',
      medium: '6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.5)',
      large: '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
      xlarge: '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
    },
    inset: {
      small: 'inset 3px 3px 6px rgba(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.5)',
      medium: 'inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
      large: 'inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.5)',
    },
    hover: {
      small: '6px 6px 12px rgba(163, 177, 198, 0.7), -6px -6px 12px rgba(255, 255, 255, 0.6)',
      medium: '8px 8px 16px rgba(163, 177, 198, 0.7), -8px -8px 16px rgba(255, 255, 255, 0.6)',
      large: '10px 10px 20px rgba(163, 177, 198, 0.7), -10px -10px 20px rgba(255, 255, 255, 0.6)',
    },
  },

  /**
   * Border radius values
   * Neumorphism uses larger border radius for softer appearance
   */
  borderRadius: {
    small: '0px',
    medium: '0px',
    large: '0px',
    xlarge: '0px',
    full: '0px',
  },

  /**
   * Spacing values
   * Increased spacing for better breathing room
   */
  spacing: {
    tight: '12px',
    normal: '16px',
    relaxed: '20px',
    loose: '24px',
    spacious: '32px',
  },

  /**
   * Text colors for neumorphic backgrounds
   * Darker colors for better contrast on #E0E5EC
   */
  textColors: {
    primary: '#1E293B',
    secondary: '#334155',
    tertiary: '#64748B',
    disabled: '#94A3B8',
  },

  /**
   * Interactive state colors
   */
  interactive: {
    focus: '#3B82F6',
    focusRing: 'rgba(59, 130, 246, 0.1)',
  },
} as const;

/**
 * TypeScript types for neumorphism tokens
 */
export type NeumorphismTokens = typeof NEUMORPHISM_TOKENS;
