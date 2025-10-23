/**
 * Type definitions barrel export
 *
 * This file re-exports all type definitions for convenient importing.
 * Usage: import { Pt, Line, Scale } from '@/types';
 */

// Canvas types
export type { Pt, ViewportTransform } from './canvas.types';

// Drawing types
export type {
  Line,
  DrawingPhase,
  DuctType,
  Material,
  Gauge,
  LineMetadata,
  LineEndpoint,
  LineConnection,
  LineConnectionMap,
  ConnectionGraph
} from './drawing.types';

// Duct types
export type {
  MaterialOption,
  GaugeOption,
  DuctTypeConfig,
  LayerConfig
} from './duct.types';

// Modal types
export type {
  ModalTab,
  ModalPosition,
  CalculationResults,
  ValidationResult,
  MultiSelectState,
  AggregateStats,
  ModalState,
  DropdownOption
} from './modal.types';

// Snap types
export type { SnapType, SnapTarget } from './snap.types';

// Scale types
export type {
  ScaleUnit,
  ScaleType,
  Scale,
  LineSummaryRow
} from './scale.types';

// PDF types
export type { PdfState } from './pdf.types';
