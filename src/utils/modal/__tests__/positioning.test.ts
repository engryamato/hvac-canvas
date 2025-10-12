/**
 * Unit Tests for Modal Positioning Utilities
 * 
 * Tests all positioning functions with comprehensive coverage including:
 * - Boundary collision detection
 * - Position adjustment for boundaries
 * - Modal positioning strategies (below, above, left, right)
 * - Edge cases and fallback behavior
 * 
 * Target: 100% code coverage
 */

import { describe, it, expect } from 'vitest';
import {
  checkBoundaryCollision,
  adjustPositionForBoundaries,
  calculateModalPosition,
  type CanvasBounds,
  type ViewportInfo,
} from '../positioning';
import type { Line } from '../../../types/drawing.types';
import { MODAL_WIDTH, EDGE_CLEARANCE } from '../../../constants/modal.constants';

describe('Modal Positioning Utilities', () => {
  // Test data
  const defaultCanvasBounds: CanvasBounds = {
    width: 1920,
    height: 1080,
    top: 0,
    left: 0,
  };

  const defaultViewport: ViewportInfo = {
    scale: 1,
    offset: { x: 0, y: 0 },
  };

  const createLine = (id: string, ax: number, ay: number, bx: number, by: number): Line => ({
    id,
    a: { x: ax, y: ay },
    b: { x: bx, y: by },
    width: 8,
    color: '#2563eb',
    type: 'supply',
    layer: 'Default',
    material: 'Galvanized Steel',
    gauge: '26ga',
    airflow: 0,
    notes: '',
    tags: [],
    customProperties: {},
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  });

  describe('checkBoundaryCollision', () => {
    const modalWidth = MODAL_WIDTH; // 220px
    const modalHeight = 280;

    it('should return false for position well within bounds', () => {
      const position = { x: 500, y: 500 };
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(collision).toBe(false);
    });

    it('should return true when modal overflows left edge', () => {
      const position = { x: 0, y: 500 }; // Less than EDGE_CLEARANCE
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(collision).toBe(true);
    });

    it('should return true when modal overflows right edge', () => {
      const position = { x: 1800, y: 500 }; // Would overflow right
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(collision).toBe(true);
    });

    it('should return true when modal overflows top edge', () => {
      const position = { x: 500, y: 0 }; // Less than EDGE_CLEARANCE
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(collision).toBe(true);
    });

    it('should return true when modal overflows bottom edge', () => {
      const position = { x: 500, y: 900 }; // Would overflow bottom
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(collision).toBe(true);
    });

    it('should respect EDGE_CLEARANCE margin', () => {
      const position = { x: EDGE_CLEARANCE, y: EDGE_CLEARANCE };
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(collision).toBe(false);
    });

    it('should handle custom canvas bounds with offset', () => {
      const customBounds: CanvasBounds = {
        width: 1000,
        height: 800,
        top: 100,
        left: 200,
      };
      const position = { x: 250, y: 150 }; // Within custom bounds
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        customBounds
      );
      expect(collision).toBe(false);
    });

    it('should detect collision with custom bounds offset', () => {
      const customBounds: CanvasBounds = {
        width: 1000,
        height: 800,
        top: 100,
        left: 200,
      };
      const position = { x: 100, y: 50 }; // Outside custom bounds
      const collision = checkBoundaryCollision(
        position,
        modalWidth,
        modalHeight,
        customBounds
      );
      expect(collision).toBe(true);
    });
  });

  describe('adjustPositionForBoundaries', () => {
    const modalWidth = MODAL_WIDTH;
    const modalHeight = 280;

    it('should not adjust position when already within bounds', () => {
      const position = { x: 500, y: 500 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(adjusted).toEqual(position);
    });

    it('should adjust position when overflowing left edge', () => {
      const position = { x: 0, y: 500 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(adjusted.x).toBe(EDGE_CLEARANCE);
      expect(adjusted.y).toBe(500);
    });

    it('should adjust position when overflowing right edge', () => {
      const position = { x: 1800, y: 500 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(adjusted.x).toBe(1920 - modalWidth - EDGE_CLEARANCE);
      expect(adjusted.y).toBe(500);
    });

    it('should adjust position when overflowing top edge', () => {
      const position = { x: 500, y: 0 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(adjusted.x).toBe(500);
      expect(adjusted.y).toBe(EDGE_CLEARANCE);
    });

    it('should adjust position when overflowing bottom edge', () => {
      const position = { x: 500, y: 1000 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(adjusted.x).toBe(500);
      expect(adjusted.y).toBe(1080 - modalHeight - EDGE_CLEARANCE);
    });

    it('should adjust both x and y when overflowing multiple edges', () => {
      const position = { x: 0, y: 0 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        defaultCanvasBounds
      );
      expect(adjusted.x).toBe(EDGE_CLEARANCE);
      expect(adjusted.y).toBe(EDGE_CLEARANCE);
    });

    it('should handle custom canvas bounds', () => {
      const customBounds: CanvasBounds = {
        width: 1000,
        height: 800,
        top: 100,
        left: 200,
      };
      const position = { x: 100, y: 50 };
      const adjusted = adjustPositionForBoundaries(
        position,
        modalWidth,
        modalHeight,
        customBounds
      );
      expect(adjusted.x).toBe(200 + EDGE_CLEARANCE);
      expect(adjusted.y).toBe(100 + EDGE_CLEARANCE);
    });
  });

  describe('calculateModalPosition', () => {
    const modalHeight = 280;

    it('should position modal below-center when space available', () => {
      const line = createLine('line1', 500, 300, 700, 300);
      const lines = [line];
      
      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.placement).toBe('below');
      expect(position.x).toBeCloseTo(600 - MODAL_WIDTH / 2, 0); // Center of line
      expect(position.y).toBe(300 + EDGE_CLEARANCE); // Below line
    });

    it('should position modal above-center when no space below', () => {
      const line = createLine('line1', 500, 900, 700, 900); // Near bottom
      const lines = [line];
      
      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.placement).toBe('above');
      expect(position.y).toBeLessThan(900); // Above line
    });

    it('should adjust position when constrained by small bounds', () => {
      const line = createLine('line1', 100, 200, 300, 200); // Left side
      const lines = [line];
      const smallBounds: CanvasBounds = {
        width: 600,
        height: 400,
        top: 0,
        left: 0,
      };

      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        smallBounds
      );

      // Should be adjusted to fit within bounds
      expect(position.x).toBeGreaterThanOrEqual(EDGE_CLEARANCE);
      expect(position.y).toBeGreaterThanOrEqual(EDGE_CLEARANCE);
      expect(position.x + MODAL_WIDTH).toBeLessThanOrEqual(600 - EDGE_CLEARANCE);
      expect(position.y + modalHeight).toBeLessThanOrEqual(400 - EDGE_CLEARANCE);
    });

    it('should fallback to below-center with adjustment when no good position', () => {
      const line = createLine('line1', 100, 100, 200, 100); // Top-left corner
      const lines = [line];
      
      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.placement).toBe('below');
      // Should be adjusted to fit within bounds
      expect(position.x).toBeGreaterThanOrEqual(EDGE_CLEARANCE);
      expect(position.y).toBeGreaterThanOrEqual(EDGE_CLEARANCE);
    });

    it('should return center position when line not found', () => {
      const lines: Line[] = [];
      
      const position = calculateModalPosition(
        'nonexistent',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.placement).toBe('below');
      expect(position.x).toBeCloseTo(defaultCanvasBounds.width / 2 - MODAL_WIDTH / 2, 0);
      expect(position.y).toBeCloseTo(defaultCanvasBounds.height / 2 - modalHeight / 2, 0);
    });

    it('should handle vertical lines correctly', () => {
      const line = createLine('line1', 500, 200, 500, 600); // Vertical line
      const lines = [line];
      
      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.placement).toBe('below');
      expect(position.x).toBeCloseTo(500 - MODAL_WIDTH / 2, 0); // Centered on line
      expect(position.y).toBe(600 + EDGE_CLEARANCE); // Below bottom of line
    });

    it('should handle horizontal lines correctly', () => {
      const line = createLine('line1', 200, 500, 800, 500); // Horizontal line
      const lines = [line];
      
      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.placement).toBe('below');
      expect(position.x).toBeCloseTo(500 - MODAL_WIDTH / 2, 0); // Center of line
      expect(position.y).toBe(500 + EDGE_CLEARANCE); // Below line
    });

    it('should respect EDGE_CLEARANCE from line', () => {
      const line = createLine('line1', 500, 300, 700, 300);
      const lines = [line];
      
      const position = calculateModalPosition(
        'line1',
        lines,
        defaultViewport,
        modalHeight,
        defaultCanvasBounds
      );

      expect(position.y).toBe(300 + EDGE_CLEARANCE);
    });
  });
});

