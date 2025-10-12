/**
 * Duct-related constants
 * 
 * This file contains constants for duct types, materials, gauges, layers,
 * and standard dimensions used throughout the HVAC canvas application.
 */

import type { DuctTypeConfig, MaterialOption, GaugeOption, LayerConfig } from '../types/duct.types';

/**
 * Duct type configurations
 * Supply ducts are blue, Return ducts are red
 */
export const DUCT_TYPES: Record<'supply' | 'return', DuctTypeConfig> = {
  supply: {
    value: 'supply',
    label: 'Supply',
    color: '#2563eb', // Blue
    description: 'Supply air duct (conditioned air to spaces)',
  },
  return: {
    value: 'return',
    label: 'Return',
    color: '#dc2626', // Red
    description: 'Return air duct (air returning from spaces)',
  },
};

/**
 * Standard duct widths in inches
 * Even numbers from 4" to 40" (common rectangular duct sizes)
 */
export const STANDARD_WIDTHS: number[] = [
  4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
];

/**
 * Quick-select width chips (most common sizes)
 * Displayed as quick-select buttons in Properties tab
 */
export const QUICK_WIDTH_CHIPS: number[] = [6, 8, 10, 12, 14];

/**
 * Material options with properties
 */
export const MATERIALS: MaterialOption[] = [
  {
    value: 'Galvanized Steel',
    label: 'Galvanized Steel',
    description: 'Most common duct material',
    commonUses: ['General HVAC', 'Commercial', 'Residential'],
  },
  {
    value: 'Stainless Steel',
    label: 'Stainless Steel',
    description: 'Corrosion-resistant, high durability',
    commonUses: ['Corrosive environments', 'Food service', 'Medical'],
  },
  {
    value: 'Aluminum',
    label: 'Aluminum',
    description: 'Lightweight, corrosion-resistant',
    commonUses: ['Coastal areas', 'Clean rooms', 'Special applications'],
  },
  {
    value: 'Fiberglass',
    label: 'Fiberglass',
    description: 'Insulated, sound-dampening',
    commonUses: ['Sound control', 'Thermal insulation', 'VAV systems'],
  },
  {
    value: 'Flex Duct',
    label: 'Flex Duct',
    description: 'Flexible, easy installation',
    commonUses: ['Residential', 'Branch runs', 'Tight spaces'],
  },
];

/**
 * Gauge options with thickness information
 * Lower gauge number = thicker metal
 */
export const GAUGES: GaugeOption[] = [
  {
    value: '26ga',
    label: '26 ga',
    thickness: 0.019,
    thicknessDisplay: '0.019" thick',
  },
  {
    value: '24ga',
    label: '24 ga',
    thickness: 0.024,
    thicknessDisplay: '0.024" thick',
  },
  {
    value: '22ga',
    label: '22 ga',
    thickness: 0.030,
    thicknessDisplay: '0.030" thick',
  },
  {
    value: '20ga',
    label: '20 ga',
    thickness: 0.036,
    thicknessDisplay: '0.036" thick',
  },
  {
    value: '18ga',
    label: '18 ga',
    thickness: 0.048,
    thicknessDisplay: '0.048" thick',
  },
];

/**
 * Default layer configurations
 */
export const LAYERS: LayerConfig[] = [
  {
    value: 'Default',
    label: 'Default',
    isDefault: true,
  },
  {
    value: 'Supply',
    label: 'Supply',
    isDefault: true,
  },
  {
    value: 'Return',
    label: 'Return',
    isDefault: true,
  },
  {
    value: 'Exhaust',
    label: 'Exhaust',
    isDefault: true,
  },
  {
    value: 'Fresh Air',
    label: 'Fresh Air',
    isDefault: true,
  },
];

/**
 * Default values for new duct lines
 */
export const DEFAULT_DUCT_PROPERTIES = {
  type: 'supply' as const,
  layer: 'Default',
  material: 'Galvanized Steel' as const,
  gauge: '26ga' as const,
  airflow: 0,
  notes: '',
  tags: [] as string[],
  customProperties: {} as Record<string, string>,
};

