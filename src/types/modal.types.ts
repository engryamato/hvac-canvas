/**
 * Modal-specific type definitions
 * 
 * This file contains types and interfaces for the Line Properties Modal,
 * including tab navigation, positioning, calculations, and multi-select state.
 */

import type { Line } from './drawing.types';

/**
 * Modal tab identifier
 */
export type ModalTab = 'properties' | 'calculations' | 'advanced';

/**
 * Modal position on canvas
 */
export interface ModalPosition {
  /** X coordinate in canvas space */
  x: number;
  /** Y coordinate in canvas space */
  y: number;
  /** Placement relative to selected line */
  placement: 'below' | 'above' | 'left' | 'right';
}

/**
 * HVAC calculation results
 */
export interface CalculationResults {
  /** Air velocity in feet per minute (fpm) */
  velocity: number;
  /** Friction loss in inches water column per 100 feet (in.wc/100ft) */
  friction: number;
  /** Velocity pressure in inches (in) */
  pressure: number;
  /** Whether velocity exceeds recommended maximum (1500 fpm) */
  hasWarning: boolean;
  /** Suggested optimal width if velocity is too high */
  suggestedWidth?: number;
}

/**
 * Validation result for calculations
 */
export interface ValidationResult {
  /** Whether the values are valid */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Suggestions for improvement */
  suggestions: string[];
}

/**
 * Multi-select state for batch editing
 */
export interface MultiSelectState {
  /** IDs of selected lines */
  selectedLineIds: string[];
  /** Whether in multi-select mode */
  isMultiSelect: boolean;
  /** Aggregate statistics */
  aggregateStats: AggregateStats;
  /** Mixed values (properties that differ across selected lines) */
  mixedValues: Set<keyof Line>;
}

/**
 * Aggregate statistics for multi-select
 */
export interface AggregateStats {
  /** Total count of selected lines */
  count: number;
  /** Total length of all selected lines in inches */
  totalLength: number;
  /** Formatted total length string (e.g., "14.7\"" or "14' 7\"") */
  totalLengthFormatted: string;
}

/**
 * Modal state for managing UI
 */
export interface ModalState {
  /** Whether modal is open */
  isOpen: boolean;
  /** Currently active tab */
  activeTab: ModalTab;
  /** Which sections are expanded */
  expandedSections: {
    properties: boolean;
  };
  /** Pending changes not yet applied */
  pendingChanges: Partial<Line>;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
}

/**
 * Dropdown option for UI components
 */
export interface DropdownOption<T = any> {
  /** Option value */
  value: T;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon or color indicator */
  icon?: string;
  /** Whether option is disabled */
  disabled?: boolean;
}

