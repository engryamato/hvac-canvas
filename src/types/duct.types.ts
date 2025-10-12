/**
 * Duct-specific type definitions
 * 
 * This file contains types and interfaces for HVAC duct properties,
 * including materials, gauges, and configuration options.
 */

import type { DuctType, Material, Gauge } from './drawing.types';

/**
 * Material option with display information and properties
 */
export interface MaterialOption {
  /** Material type identifier */
  value: Material;
  /** Display name for UI */
  label: string;
  /** Material description */
  description: string;
  /** Common use cases */
  commonUses: string[];
}

/**
 * Gauge option with thickness information
 */
export interface GaugeOption {
  /** Gauge identifier */
  value: Gauge;
  /** Display name for UI (e.g., "26 ga") */
  label: string;
  /** Actual thickness in inches */
  thickness: number;
  /** Display format for thickness (e.g., "0.019\" thick") */
  thicknessDisplay: string;
}

/**
 * Duct type configuration with visual properties
 */
export interface DuctTypeConfig {
  /** Duct type identifier */
  value: DuctType;
  /** Display name for UI */
  label: string;
  /** Color for visual representation (hex) */
  color: string;
  /** Description */
  description: string;
}

/**
 * Layer configuration for organizing duct lines
 */
export interface LayerConfig {
  /** Layer identifier */
  value: string;
  /** Display name for UI */
  label: string;
  /** Whether this is a default/system layer */
  isDefault: boolean;
}

// Re-export types from drawing.types for convenience
export type { DuctType, Material, Gauge } from './drawing.types';

