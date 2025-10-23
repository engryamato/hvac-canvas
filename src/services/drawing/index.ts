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
  removeLines,
  updateLineWidth as updateLineWidthInCollection,
  updateLineColor as updateLineColorInCollection,
  updateLineLength,
  findLineById,
  getLinesByWidth,
  getUniqueWidths,
} from './LineManager';

export {
  findLineHit,
  findEndpointHit,
} from './HitTestService';

export {
  drawLines,
  drawSnapIndicator,
  drawDraftLine,
  type DrawLinesOptions,
} from './CanvasRenderService';

export {
  normalizeCoordinate,
  buildConnectionGraph,
  getConnectedEndpoints,
  getConnectionsForLine,
} from './ConnectionService';
