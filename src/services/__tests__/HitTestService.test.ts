/**
 * Hit Test Service tests
 */

import { describe, it, expect } from 'vitest';
import { findLineHit, findEndpointHit } from '../drawing/HitTestService';
import { initializeLineDefaults } from '../line/LinePropertiesService';
import type { Line } from '../../types';

const createLine = (overrides: Partial<Line> = {}): Line =>
  initializeLineDefaults({
    id: overrides.id ?? 'line-1',
    a: overrides.a ?? { x: 0, y: 0 },
    b: overrides.b ?? { x: 100, y: 0 },
    width: overrides.width ?? 8,
    color: overrides.color ?? '#2563eb',
    ...overrides,
  });

describe('HitTestService', () => {
  describe('findLineHit', () => {
    it('should return line id when point is within tolerance', () => {
      const line = createLine({ id: 'line-a' });
      const hit = findLineHit([line], { x: 50, y: 2 });
      expect(hit).toBe('line-a');
    });

    it('should return null when point is outside tolerance', () => {
      const line = createLine({ id: 'line-a' });
      const hit = findLineHit([line], { x: 50, y: 200 });
      expect(hit).toBeNull();
    });

    it('should return closest line when multiple are within tolerance', () => {
      const lineA = createLine({ id: 'line-a', width: 8 });
      const lineB = createLine({
        id: 'line-b',
        a: { x: 0, y: 20 },
        b: { x: 100, y: 20 },
        width: 20,
      });
      const hit = findLineHit([lineA, lineB], { x: 50, y: 18 });
      expect(hit).toBe('line-b');
    });
  });

  describe('findEndpointHit', () => {
    it('should detect point near start endpoint', () => {
      const line = createLine();
      const endpoint = findEndpointHit(line, { x: 2, y: 1 }, 10);
      expect(endpoint).toBe('a');
    });

    it('should detect point near end endpoint', () => {
      const line = createLine();
      const endpoint = findEndpointHit(line, { x: 102, y: 1 }, 10);
      expect(endpoint).toBe('b');
    });

    it('should return null when point is not near endpoints', () => {
      const line = createLine();
      const endpoint = findEndpointHit(line, { x: 50, y: 50 }, 10);
      expect(endpoint).toBeNull();
    });
  });
});
