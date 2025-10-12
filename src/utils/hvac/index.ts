/**
 * HVAC utilities barrel export
 * 
 * Re-exports all HVAC calculation utilities for convenient importing.
 * Usage: import { calculateVelocity, calculateFriction } from '@/utils/hvac';
 */

export {
  calculateVelocity,
  calculateFriction,
  calculatePressure,
  formatCalculationResult,
  suggestOptimalWidth,
  validateCalculationResults,
} from './calculations';

