/**
 * Drawing services barrel export
 */

export {
  createLine,
  validateLine,
  calculateLineLength,
  updateLineWidth,
  updateLineColor,
  type CreateLineParams,
  type CreateLineResult,
} from './DrawingService';

export {
  addLine,
  removeLine,
  updateLineWidth as updateLineWidthInCollection,
  updateLineColor as updateLineColorInCollection,
  findLineById,
  getLinesByWidth,
  getUniqueWidths,
} from './LineManager';

