/**
 * Services barrel export
 * 
 * This file re-exports all service functions for convenient importing.
 * Services encapsulate business logic and orchestrate utilities.
 * 
 * Usage: import { createLine, calculateZoom } from '@/services';
 */

// Drawing services
export {
  createLine,
  validateLine,
  calculateLineLength,
  updateLineWidth,
  updateLineColor,
  addLine,
  removeLine,
  removeLines,
  updateLineWidthInCollection,
  updateLineColorInCollection,
  updateLineLength,
  findLineById,
  getLinesByWidth,
  getUniqueWidths,
  findLineHit,
  findEndpointHit,
  drawLines,
  drawSnapIndicator,
  drawDraftLine,
  type CreateLineParams,
  type CreateLineResult,
} from './drawing';

// Viewport services
export {
  calculateZoom,
  canZoomIn,
  canZoomOut,
  calculateZoomOffset,
  calculatePanOffset,
  calculatePinchZoomOffset,
  resetViewport,
  transformScreenToCanvas,
  transformCanvasToScreen,
} from './viewport';

// Line property services
export {
  initializeLineDefaults,
  updateLineProperties,
  validateLineProperties,
  batchUpdateLines,
  getMixedValue,
  duplicateLine,
  calculateAggregateStats,
} from './line';
