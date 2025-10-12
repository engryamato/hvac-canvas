/**
 * HVAC Calculation Utilities
 * 
 * This module provides pure functions for HVAC airflow calculations including
 * velocity, friction loss, and pressure calculations for rectangular ducts.
 * 
 * All calculations follow standard HVAC engineering formulas and best practices.
 */

import {
  WRIGHT_EQUATION,
  EQUIVALENT_DIAMETER,
  VELOCITY_PRESSURE_CONSTANT,
  CONVERSIONS,
  PRECISION,
  MAX_RECOMMENDED_VELOCITY,
} from '../../constants/calculations.constants';
import { STANDARD_WIDTHS } from '../../constants/duct.constants';

/**
 * Calculate air velocity in a rectangular duct
 * 
 * Formula: V = (CFM × 144) / (W² × π/4)
 * where:
 *   V = velocity in feet per minute (fpm)
 *   CFM = airflow in cubic feet per minute
 *   W = duct width in inches (assuming square duct)
 *   144 = square inches per square foot
 * 
 * @param cfm - Airflow in cubic feet per minute
 * @param width - Duct width in inches (assumes square duct)
 * @returns Velocity in feet per minute (fpm)
 * 
 * @example
 * ```typescript
 * const velocity = calculateVelocity(500, 8);
 * // Returns: 1432 fpm (for 500 CFM through 8" square duct)
 * ```
 * 
 * @throws {Error} If CFM or width is negative or zero
 */
export function calculateVelocity(cfm: number, width: number): number {
  if (cfm < 0) {
    throw new Error('CFM cannot be negative');
  }
  if (width <= 0) {
    throw new Error('Width must be greater than zero');
  }

  // For square duct: Area = width²
  // For circular equivalent: Area = width² × π/4
  // Using circular equivalent for more accurate velocity calculation
  const area = (width * width * Math.PI) / 4; // in square inches
  const areaInSqFt = area / CONVERSIONS.SQ_IN_PER_SQ_FT;
  
  const velocity = cfm / areaInSqFt;
  
  return Math.round(velocity); // Return whole number per PRECISION.VELOCITY
}

/**
 * Calculate friction loss in a rectangular duct using the Wright equation
 * 
 * Wright Equation: F = (0.109136 × Q^1.9) / (D^5.02)
 * where:
 *   F = friction loss in inches water column per 100 feet (in.wc/100ft)
 *   Q = airflow in CFM
 *   D = equivalent round diameter in inches
 * 
 * Equivalent Diameter: D = 1.30 × ((W × W)^0.625) / ((W + W)^0.25)
 * where W = duct width (assuming square duct)
 * 
 * @param velocity - Air velocity in feet per minute (fpm)
 * @param width - Duct width in inches (assumes square duct)
 * @param length - Duct length in feet (for scaling friction loss)
 * @returns Friction loss in inches water column per 100 feet (in.wc/100ft)
 * 
 * @example
 * ```typescript
 * const friction = calculateFriction(1432, 8, 100);
 * // Returns: 0.08 in.wc/100ft (for 1432 fpm through 8" duct)
 * ```
 * 
 * @throws {Error} If velocity, width, or length is negative or zero
 */
export function calculateFriction(velocity: number, width: number, length: number): number {
  if (velocity < 0) {
    throw new Error('Velocity cannot be negative');
  }
  if (width <= 0) {
    throw new Error('Width must be greater than zero');
  }
  if (length <= 0) {
    throw new Error('Length must be greater than zero');
  }

  // Calculate CFM from velocity
  const area = (width * width * Math.PI) / 4; // square inches
  const areaInSqFt = area / CONVERSIONS.SQ_IN_PER_SQ_FT;
  const cfm = velocity * areaInSqFt;

  // Calculate equivalent round diameter for square duct
  // D = 1.30 × ((W × W)^0.625) / ((W + W)^0.25)
  const widthProduct = width * width;
  const widthSum = width + width;
  const diameter = 
    EQUIVALENT_DIAMETER.COEFFICIENT *
    Math.pow(widthProduct, EQUIVALENT_DIAMETER.WIDTH_EXPONENT) /
    Math.pow(widthSum, EQUIVALENT_DIAMETER.PERIMETER_EXPONENT);

  // Wright equation: F = (0.109136 × Q^1.9) / (D^5.02)
  const friction =
    (WRIGHT_EQUATION.COEFFICIENT * Math.pow(cfm, WRIGHT_EQUATION.CFM_EXPONENT)) /
    Math.pow(diameter, WRIGHT_EQUATION.DIAMETER_EXPONENT);

  // Return friction loss per 100 feet with proper precision
  return Number(friction.toFixed(PRECISION.FRICTION));
}

/**
 * Calculate velocity pressure in a duct
 * 
 * Formula: VP = (V / 4005)²
 * where:
 *   VP = velocity pressure in inches of water
 *   V = velocity in feet per minute (fpm)
 *   4005 = constant for standard air density
 * 
 * @param velocity - Air velocity in feet per minute (fpm)
 * @returns Velocity pressure in inches of water
 * 
 * @example
 * ```typescript
 * const pressure = calculatePressure(1432);
 * // Returns: 0.1276 in (for 1432 fpm)
 * ```
 * 
 * @throws {Error} If velocity is negative
 */
export function calculatePressure(velocity: number): number {
  if (velocity < 0) {
    throw new Error('Velocity cannot be negative');
  }

  const pressure = Math.pow(velocity / VELOCITY_PRESSURE_CONSTANT, 2);
  
  return Number(pressure.toFixed(PRECISION.PRESSURE));
}

/**
 * Format a calculation result with proper precision and units
 * 
 * @param value - Numeric value to format
 * @param unit - Unit string (e.g., 'fpm', 'in.wc', 'in')
 * @param precision - Number of decimal places (default: 0)
 * @returns Formatted string with value and unit
 * 
 * @example
 * ```typescript
 * formatCalculationResult(1432.5, 'fpm', 0);
 * // Returns: "1,433 fpm"
 * 
 * formatCalculationResult(0.0834, 'in.wc', 2);
 * // Returns: "0.08 in.wc"
 * ```
 */
export function formatCalculationResult(
  value: number,
  unit: string,
  precision: number = 0
): string {
  const rounded = Number(value.toFixed(precision));
  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
  
  return `${formatted} ${unit}`;
}

/**
 * Suggest optimal duct width when velocity exceeds target
 * 
 * Finds the next standard width that would bring velocity below the target.
 * Uses STANDARD_WIDTHS constant for available sizes.
 * 
 * @param currentWidth - Current duct width in inches
 * @param velocity - Current velocity in fpm
 * @param targetVelocity - Target maximum velocity in fpm (default: 1500)
 * @returns Suggested width in inches, or undefined if no larger size available
 * 
 * @example
 * ```typescript
 * const suggested = suggestOptimalWidth(8, 1800, 1500);
 * // Returns: 10 (next size up that would reduce velocity below 1500 fpm)
 * ```
 */
export function suggestOptimalWidth(
  currentWidth: number,
  velocity: number,
  targetVelocity: number = MAX_RECOMMENDED_VELOCITY
): number | undefined {
  if (velocity <= targetVelocity) {
    return undefined; // No suggestion needed
  }

  // Calculate current CFM
  const area = (currentWidth * currentWidth * Math.PI) / 4;
  const areaInSqFt = area / CONVERSIONS.SQ_IN_PER_SQ_FT;
  const cfm = velocity * areaInSqFt;

  // Find the smallest width that would bring velocity below target
  for (const width of STANDARD_WIDTHS) {
    if (width <= currentWidth) continue; // Skip current and smaller sizes
    
    const newVelocity = calculateVelocity(cfm, width);
    if (newVelocity <= targetVelocity) {
      return width;
    }
  }

  // If no standard width is large enough, return the largest available
  return STANDARD_WIDTHS[STANDARD_WIDTHS.length - 1];
}

/**
 * Validate calculation results and provide warnings/suggestions
 * 
 * Checks if velocity exceeds recommended maximum and provides
 * actionable feedback.
 * 
 * @param velocity - Air velocity in fpm
 * @param currentWidth - Current duct width in inches
 * @returns Validation result with errors, warnings, and suggestions
 * 
 * @example
 * ```typescript
 * const result = validateCalculationResults(1800, 8);
 * // Returns: {
 * //   isValid: true,
 * //   errors: [],
 * //   warnings: ['Velocity exceeds recommended maximum (1500 fpm)'],
 * //   suggestions: ['Consider increasing duct width to 10"']
 * // }
 * ```
 */
export function validateCalculationResults(
  velocity: number,
  currentWidth: number
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for invalid values
  if (velocity < 0) {
    errors.push('Velocity cannot be negative');
  }
  if (currentWidth <= 0) {
    errors.push('Width must be greater than zero');
  }

  // Check velocity threshold
  if (velocity > MAX_RECOMMENDED_VELOCITY) {
    warnings.push(`Velocity exceeds recommended maximum (${MAX_RECOMMENDED_VELOCITY} fpm)`);
    
    const suggestedWidth = suggestOptimalWidth(currentWidth, velocity);
    if (suggestedWidth) {
      suggestions.push(`Consider increasing duct width to ${suggestedWidth}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

