/**
 * ID generation utility
 * 
 * This file contains a simple utility for generating unique IDs.
 */

/**
 * Generate a unique ID
 * 
 * Creates a random alphanumeric string suitable for use as a unique identifier.
 * Uses base-36 encoding of a random number.
 * 
 * @returns A unique ID string (7 characters)
 * 
 * @example
 * const lineId = uid();
 * // Returns: "a3f9k2l" (example, will be different each time)
 * 
 * @note This is not cryptographically secure and should not be used
 * for security-sensitive purposes. For production use, consider using
 * a more robust solution like UUID v4.
 */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

