/**
 * Canvas Render Service
 *
 * Provides helpers for rendering the canvas scene including lines, selections,
 * snap indicators, and draft previews. Encapsulating this logic keeps the
 * component focused on orchestration rather than drawing details.
 */

import type { Line, Pt, SnapTarget } from '../../types';
import {
  SELECTION_HIGHLIGHT_WIDTH,
  SNAP_INDICATOR_COLOR,
  SNAP_INDICATOR_FILL,
  SNAP_INDICATOR_RADIUS,
} from '../../constants';

const END_CAP_RADIUS_FACTOR = 0.35;

/**
 * Options for drawing the line collection.
 */
export interface DrawLinesOptions {
  /** IDs of currently selected lines */
  selectedLineIds: string[];
  /** Current viewport scale (affects handle sizes) */
  viewportScale: number;
}

/**
 * Draw all lines onto the canvas, including selection halos and endpoint handles.
 *
 * @param ctx - Canvas rendering context
 * @param lines - Line collection
 * @param options - Drawing options
 */
export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  options: DrawLinesOptions
): void {
  const drawSegmentWithCaps = (
    start: Pt,
    end: Pt,
    strokeWidth: number,
    strokeColor: string
  ) => {
    ctx.save();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();

    if (strokeWidth <= 0) {
      return;
    }

    const radius = strokeWidth * END_CAP_RADIUS_FACTOR;
    if (radius <= 0) {
      return;
    }

    ctx.save();
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(end.x, end.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const { selectedLineIds, viewportScale } = options;
  const selectedIdSet = new Set(selectedLineIds);
  const singleSelection = selectedLineIds.length === 1 ? selectedLineIds[0] : null;

  for (const line of lines) {
    if (!line?.a || !line?.b || typeof line.width !== 'number') {
      continue;
    }

    drawSegmentWithCaps(line.a, line.b, line.width, line.color);

    if (selectedIdSet.has(line.id)) {
      const selectionColor = line.type === 'supply' ? '#2563eb' : '#dc2626';
      drawSegmentWithCaps(
        line.a,
        line.b,
        line.width + SELECTION_HIGHLIGHT_WIDTH,
        `${selectionColor}40`
      );

      if (singleSelection === line.id) {
        const handleRadius = 6 / viewportScale;
        const handleStroke = 2 / viewportScale;

        ctx.beginPath();
        ctx.arc(line.a.x, line.a.y, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = selectionColor;
        ctx.lineWidth = handleStroke;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(line.b.x, line.b.y, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = selectionColor;
        ctx.lineWidth = handleStroke;
        ctx.stroke();
      }
    }
  }
}

/**
 * Draw the snap indicator at the active snap target.
 *
 * @param ctx - Canvas rendering context
 * @param snapTarget - Active snap target
 * @param viewportScale - Current viewport scale
 */
export function drawSnapIndicator(
  ctx: CanvasRenderingContext2D,
  snapTarget: SnapTarget,
  viewportScale: number
): void {
  ctx.beginPath();
  ctx.arc(
    snapTarget.point.x,
    snapTarget.point.y,
    SNAP_INDICATOR_RADIUS / viewportScale,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = SNAP_INDICATOR_FILL;
  ctx.fill();
  ctx.strokeStyle = SNAP_INDICATOR_COLOR;
  ctx.lineWidth = 2 / viewportScale;
  ctx.stroke();
}

/**
 * Draw the dashed preview line while in drawing mode.
 *
 * @param ctx - Canvas rendering context
 * @param start - Start point of draft line
 * @param end - End point of draft line
 * @param width - Draft line width
 * @param viewportScale - Current viewport scale
 */
export function drawDraftLine(
  ctx: CanvasRenderingContext2D,
  start: Pt,
  end: Pt,
  width: number,
  viewportScale: number
): void {
  ctx.setLineDash([8 / viewportScale, 6 / viewportScale]);
  ctx.lineWidth = width;
  ctx.strokeStyle = '#64748B';
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);
}
