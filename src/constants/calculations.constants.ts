/**
 * HVAC calculation constants
 * 
 * This file contains constants used for HVAC airflow calculations,
 * including velocity, friction loss, and pressure calculations.
 */

/**
 * Maximum recommended air velocity in feet per minute (fpm)
 * Velocities above this threshold may cause excessive noise and pressure loss
 */
export const MAX_RECOMMENDED_VELOCITY = 1500;

/**
 * Wright equation constants for friction loss calculation
 * Used for rectangular duct friction loss estimation
 */
export const WRIGHT_EQUATION = {
  /** Coefficient for Wright equation */
  COEFFICIENT: 0.109136,
  /** CFM exponent */
  CFM_EXPONENT: 1.9,
  /** Diameter exponent */
  DIAMETER_EXPONENT: 5.02,
};

/**
 * Round equivalent diameter calculation constants
 * For converting rectangular ducts to equivalent round diameter
 */
export const EQUIVALENT_DIAMETER = {
  /** Coefficient for equivalent diameter formula */
  COEFFICIENT: 1.30,
  /** Width exponent */
  WIDTH_EXPONENT: 0.625,
  /** Perimeter exponent */
  PERIMETER_EXPONENT: 0.25,
};

/**
 * Velocity pressure calculation constant
 * Formula: VP = (V / 4005)²
 * where V is velocity in fpm and VP is in inches of water
 */
export const VELOCITY_PRESSURE_CONSTANT = 4005;

/**
 * Unit conversion constants
 */
export const CONVERSIONS = {
  /** Square inches per square foot */
  SQ_IN_PER_SQ_FT: 144,
  /** Inches per foot */
  IN_PER_FT: 12,
};

/**
 * Calculation precision (decimal places)
 */
export const PRECISION = {
  /** Velocity precision (whole numbers) */
  VELOCITY: 0,
  /** Friction precision (2 decimal places) */
  FRICTION: 2,
  /** Pressure precision (4 decimal places) */
  PRESSURE: 4,
  /** Length precision (1 decimal place) */
  LENGTH: 1,
};

