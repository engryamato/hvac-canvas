/**
 * Canvas Render Service tests
 */

import { describe, it, expect, vi } from 'vitest';
import {
  drawLines,
  drawSnapIndicator,
  drawDraftLine,
} from '../drawing/CanvasRenderService';
import { initializeLineDefaults } from '../line/LinePropertiesService';
import type { Line } from '../../types';

function createMockContext() {
  const base = {
    lineWidth: 0,
    strokeStyle: '',
    lineCap: '',
    lineJoin: '',
    fillStyle: '',
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    setLineDash: vi.fn(),
  };

  return base as unknown as CanvasRenderingContext2D & typeof base;
}

const createLine = (overrides: Partial<Line> = {}): Line =>
  initializeLineDefaults({
    id: overrides.id ?? 'line-1',
    a: overrides.a ?? { x: 0, y: 0 },
    b: overrides.b ?? { x: 100, y: 0 },
    width: overrides.width ?? 8,
    color: overrides.color ?? '#2563eb',
    ...overrides,
  });

describe('CanvasRenderService', () => {
  it('should draw lines and selection overlays', () => {
    const ctx = createMockContext();
    const line = createLine({ id: 'selected-line', type: 'supply' });

    drawLines(ctx, [line], {
      selectedLineIds: ['selected-line'],
      viewportScale: 1,
    });

    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalledWith(line.a.x, line.a.y);
    expect(ctx.lineTo).toHaveBeenCalledWith(line.b.x, line.b.y);
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledTimes(2);
  });

  it('should draw snap indicator with scaled radius', () => {
    const ctx = createMockContext();

    drawSnapIndicator(
      ctx,
      {
        lineId: 'line-1',
        point: { x: 50, y: 50 },
        type: 'endpoint',
        distance: 2,
      },
      2
    );

    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledWith(50, 50, expect.any(Number), 0, Math.PI * 2);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('should draw draft line with dashed style', () => {
    const ctx = createMockContext();

    drawDraftLine(
      ctx,
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      8,
      2
    );

    expect(ctx.setLineDash).toHaveBeenCalledWith([4, 3]);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(ctx.lineTo).toHaveBeenCalledWith(100, 0);
    expect(ctx.stroke).toHaveBeenCalled();
  });
});
