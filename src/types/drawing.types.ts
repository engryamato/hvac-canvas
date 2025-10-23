/**
 * Drawing-related type definitions
 *
 * This file contains types for lines, drawing state, and drawing interactions.
 */

import type { Pt } from './canvas.types';

/**
 * Duct type - Supply or Return
 */
export type DuctType = 'supply' | 'return';

/**
 * Duct material options
 */
export type Material =
  | 'Galvanized Steel'
  | 'Stainless Steel'
  | 'Aluminum'
  | 'Fiberglass'
  | 'Flex Duct';

/**
 * Duct gauge (sheet metal thickness)
 */
export type Gauge = '26ga' | '24ga' | '22ga' | '20ga' | '18ga';

/**
 * Line metadata for tracking creation and updates
 */
export type LineMetadata = {
  /** Timestamp when line was created (Unix timestamp in milliseconds) */
  createdAt: number;
  /** Timestamp when line was last updated (Unix timestamp in milliseconds) */
  updatedAt: number;
};

/**
 * Line model
 * Represents a duct line segment on the canvas with full HVAC properties
 */
export type Line = {
  /** Unique identifier for the line */
  id: string;
  /** Start point of the line */
  a: Pt;
  /** End point of the line */
  b: Pt;
  /** Duct width in inches (actual duct dimension, not visual width) */
  width: number;
  /** Stroke color (hex or CSS color string) - derived from type */
  color: string;
  /** Duct type - Supply (blue) or Return (red) */
  type: DuctType;
  /** Layer assignment for organization */
  layer: string;
  /** Duct material */
  material: Material;
  /** Sheet metal gauge (thickness) */
  gauge: Gauge;
  /** Airflow in CFM (Cubic Feet per Minute) for calculations */
  airflow: number;
  /** User notes about this duct line */
  notes: string;
  /** Tags for categorization and filtering */
  tags: string[];
  /** Custom key-value properties for project-specific data */
  customProperties: Record<string, string>;
  /** Creation and update timestamps */
  metadata: LineMetadata;
};

/**
 * Drawing phase for click-click interaction
 * - 'idle': Not currently drawing, waiting for first click
 * - 'waiting-for-end': First point set, waiting for second click to complete line
 */
export type DrawingPhase = 'idle' | 'waiting-for-end';

/**
 * Represents a single endpoint of a line
 * - 'a': Start point of the line
 * - 'b': End point of the line
 */
export type LineEndpoint = 'a' | 'b';

/**
 * Represents a connection between two line endpoints
 * Example: Line A's endpoint 'b' connects to Line B's endpoint 'a'
 */
export interface LineConnection {
  /** ID of the connected line */
  lineId: string;
  /** Which endpoint of the connected line ('a' or 'b') */
  endpoint: LineEndpoint;
}

/**
 * Connection map for a single line
 * Shows all lines connected at each endpoint
 */
export interface LineConnectionMap {
  /** Lines connected at endpoint 'a' */
  a: LineConnection[];
  /** Lines connected at endpoint 'b' */
  b: LineConnection[];
}

/**
 * Complete connection graph for all lines
 * Maps line IDs to their connection information
 *
 * Example:
 * {
 *   'line-1': { a: [], b: [{lineId: 'line-2', endpoint: 'a'}] },
 *   'line-2': { a: [{lineId: 'line-1', endpoint: 'b'}], b: [] }
 * }
 */
export type ConnectionGraph = Record<string, LineConnectionMap>;

