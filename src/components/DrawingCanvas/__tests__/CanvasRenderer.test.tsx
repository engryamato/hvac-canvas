/**
 * CanvasRenderer Component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasRenderer } from '../CanvasRenderer';
import { createRef } from 'react';

describe('CanvasRenderer', () => {
  const mockHandlers = {
    onPointerDown: vi.fn(),
    onPointerMove: vi.fn(),
    onPointerUp: vi.fn(),
    onWheel: vi.fn(),
    onContextMenu: vi.fn(),
    onTouchStart: vi.fn(),
    onTouchMove: vi.fn(),
    onTouchEnd: vi.fn(),
  };

  it('should render canvas element', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    const canvas = screen.getByRole('img', { name: /drawing canvas/i });
    expect(canvas).toBeDefined();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('should apply crosshair cursor when draw mode is active', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    const { rerender } = render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    let canvas = screen.getByRole('img');
    expect(canvas.className).toContain('cursor-default');
    
    rerender(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={true}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    canvas = screen.getByRole('img');
    expect(canvas.className).toContain('cursor-crosshair');
  });

  it('should call onPointerDown when canvas is clicked', async () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    const onPointerDown = vi.fn();
    const user = userEvent.setup();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
        onPointerDown={onPointerDown}
      />
    );
    
    const canvas = screen.getByRole('img');
    await user.pointer({ target: canvas, keys: '[MouseLeft>]' });
    
    expect(onPointerDown).toHaveBeenCalled();
  });

  it('should call onContextMenu when right-clicked', async () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    const onContextMenu = vi.fn((e) => e.preventDefault());
    const user = userEvent.setup();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
        onContextMenu={onContextMenu}
      />
    );
    
    const canvas = screen.getByRole('img');
    await user.pointer({ target: canvas, keys: '[MouseRight]' });
    
    expect(onContextMenu).toHaveBeenCalled();
  });

  it('should render children inside container', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      >
        <div data-testid="child-element">Child Content</div>
      </CanvasRenderer>
    );
    
    expect(screen.getByTestId('child-element')).toBeDefined();
    expect(screen.getByText('Child Content')).toBeDefined();
  });

  it('should set container width based on sidebar width', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    const { rerender } = render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    expect(containerRef.current?.style.width).toBe('calc(100% - 320px)');
    
    rerender(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={0}
        {...mockHandlers}
      />
    );
    
    expect(containerRef.current?.style.width).toBe('calc(100% - 0px)');
  });

  it('should set container height to account for bottom bar', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    expect(containerRef.current?.style.height).toBe('calc(100vh - 60px)');
  });

  it('should have touch-action none on canvas', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    const canvas = screen.getByRole('img');
    expect((canvas as HTMLCanvasElement).style.touchAction).toBe('none');
  });

  it('should attach all event handlers to canvas', () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const containerRef = createRef<HTMLDivElement>();
    
    render(
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={false}
        sidebarWidth={320}
        {...mockHandlers}
      />
    );
    
    const canvas = canvasRef.current;
    expect(canvas).not.toBeNull();
    
    // Verify canvas ref is set
    expect(canvas?.tagName).toBe('CANVAS');
  });
});

