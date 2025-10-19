/**
 * CanvasRenderer Component
 * 
 * Canvas element with all drawing, selection, and viewport interaction handlers.
 * Handles pointer events, wheel events, touch gestures, and rendering.
 */

import React from 'react';

/**
 * Props for CanvasRenderer component
 */
export interface CanvasRendererProps {
  /** Reference to the canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to the container element */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Whether draw mode is active */
  isDrawActive: boolean;
  /** Pointer down event handler */
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  /** Pointer move event handler */
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  /** Pointer up event handler */
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  /** Wheel event handler (for zoom) */
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  /** Context menu event handler (prevent default) */
  onContextMenu: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  /** Touch start event handler (for pinch-zoom) */
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  /** Touch move event handler (for pinch-zoom) */
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  /** Touch end event handler (for pinch-zoom) */
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  /** Width of the sidebar (for container sizing) */
  sidebarWidth: number;
  /** Children to render inside the container (e.g., HUD, DrawButton) */
  children?: React.ReactNode;
}

/**
 * CanvasRenderer Component
 * 
 * Renders the HTML5 canvas element with all interaction handlers.
 * 
 * Features:
 * - Pointer events for drawing and selection
 * - Mouse wheel zoom
 * - Right-click pan
 * - Touch gestures (pinch-zoom)
 * - Dynamic cursor based on mode
 * - Responsive sizing
 * 
 * @param props - Component props
 * 
 * @example
 * <CanvasRenderer
 *   canvasRef={canvasRef}
 *   containerRef={containerRef}
 *   isDrawActive={isDrawActive}
 *   onPointerDown={handlePointerDown}
 *   onPointerMove={handlePointerMove}
 *   onPointerUp={handlePointerUp}
 *   onWheel={handleWheel}
 *   onContextMenu={handleContextMenu}
 *   onTouchStart={handleTouchStart}
 *   onTouchMove={handleTouchMove}
 *   onTouchEnd={handleTouchEnd}
 *   sidebarWidth={320}
 * />
 */
export function CanvasRenderer(props: CanvasRendererProps): JSX.Element {
  const {
    canvasRef,
    containerRef,
    isDrawActive,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    onContextMenu,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    sidebarWidth,
    children,
  } = props;

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{
        width: `calc(100% - ${sidebarWidth}px)`,
        height: 'calc(100vh - 60px)' // Subtract bottom bar height
      }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${isDrawActive ? "cursor-crosshair" : "cursor-default"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'none' }}
        aria-label="Drawing canvas"
        role="img"
      />
      {children}
    </div>
  );
}

