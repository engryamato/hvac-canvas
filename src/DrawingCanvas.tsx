import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

// Type imports
import type {
  Pt,
  ViewportTransform,
  Line,
  DrawingPhase,
  SnapType,
  SnapTarget,
  Scale,
  ScaleUnit,
  LineSummaryRow,
} from './types';

// Constant imports
import {
  ZOOM_FACTOR,
  MIN_ZOOM,
  MAX_ZOOM,
  MIN_LINE_LENGTH,
  SELECTION_HIGHLIGHT_WIDTH,
  HIT_TEST_MIN_TOLERANCE,
  HIT_TEST_WIDTH_FACTOR,
  SNAP_INDICATOR_RADIUS,
  SNAP_INDICATOR_COLOR,
  SNAP_INDICATOR_FILL,
  TECH_BLUE_CSS_VARS,
} from './constants';

// Utility imports
import {
  dist,
  midpoint,
  getClosestPointOnSegment,
  getLineLength,
  screenToCanvas,
  canvasToScreen,
  getPointerPos,
  applyViewportTransform,
  setupHiDPICanvas,
  findSnapTarget,
  resolveSnapPoint,
  pixelsToInches,
  formatLength,
  uid,
} from './utils';

// Component imports
import {
  WidthHUD,
  DrawButton,
  Sidebar,
  BottomBar,
  CanvasRenderer,
} from './components';

/**
 * Drawing Canvas + FAB — Straight-Line (HVAC prep) Edition — FULL SCREEN
 * -----------------------------------------------------------------------
 * Changes from previous version:
 * - Canvas now covers the ENTIRE screen (100vw × 100vh)
 * - Automatically adjusts when screen/window is resized
 * - Drawn lines maintain their scale - only the canvas viewport adjusts
 * - All other functionality remains the same (straight segments, width editing, etc.)
 */

// --- Technical blue tokens (swap with your design tokens if needed) ---
const TechBlueTokens = () => (
  <style>{TECH_BLUE_CSS_VARS}</style>
);

/**
 * Custom hook for managing drawing state
 * Consolidates all drawing-related state into a single hook
 */
function useDrawingState() {
  const [phase, setPhase] = useState<DrawingPhase>('idle');
  const [startPoint, setStartPoint] = useState<Pt | null>(null);
  const [endPoint, setEndPoint] = useState<Pt | null>(null);
  const [snapTarget, setSnapTarget] = useState<SnapTarget | null>(null);

  const reset = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setSnapTarget(null);
    setPhase('idle');
  }, []);

  const startDrawing = useCallback((point: Pt, snap: SnapTarget | null) => {
    setStartPoint(point);
    setEndPoint(null);
    setSnapTarget(snap);
    setPhase('waiting-for-end');
  }, []);

  const updateEndPoint = useCallback((point: Pt, snap: SnapTarget | null) => {
    setEndPoint(point);
    setSnapTarget(snap);
  }, []);

  return {
    phase,
    startPoint,
    endPoint,
    snapTarget,
    reset,
    startDrawing,
    updateEndPoint,
    setSnapTarget
  };
}

export default function DrawingCanvasWithFAB() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  // Tool/UI state
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hudPosition, setHudPosition] = useState<{ x: number; y: number } | null>(null);

  // Drawing state (consolidated via custom hook)
  const drawingState = useDrawingState();

  // Scale management state
  const [currentScale, setCurrentScale] = useState<Scale>({
    type: 'custom',
    pixelsPerInch: 1,  // Default: 1 pixel = 1 inch
    displayName: '1:1',
    unit: 'imperial'
  });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [defaultWidth, setDefaultWidth] = useState(8);
  const [defaultColor] = useState("#111827");

  // Viewport transform state
  const [viewportScale, setViewportScale] = useState(1.0);
  const [viewportOffset, setViewportOffset] = useState<Pt>({ x: 0, y: 0 });

  // Pan interaction state (right-click only)
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Pt | null>(null);
  const [panOffsetStart, setPanOffsetStart] = useState<Pt | null>(null);

  // Touch gesture state
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [touchStartScale, setTouchStartScale] = useState(1.0);
  const [touchStartOffset, setTouchStartOffset] = useState<Pt | null>(null);

  // Helper functions
  const deleteLine = useCallback((lineId: string) => {
    setLines(prev => prev.filter(line => line.id !== lineId));
    setSelectedId(null);
    setHudPosition(null);
  }, []);

  // Clear snap target when exiting draw mode
  useEffect(() => {
    if (!isDrawActive) {
      drawingState.setSnapTarget(null);
    }
  }, [isDrawActive, drawingState]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d") setIsDrawActive(v => !v);

      // Escape key: Cancel current drawing operation
      if (e.key === "Escape" && drawingState.phase === 'waiting-for-end') {
        drawingState.reset();
      }

      // Delete/Backspace key: Delete selected line
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault(); // Prevent browser back navigation on Backspace
        deleteLine(selectedId);
      }

      if (selectedId) {
        if (e.key === "[") updateSelectedWidth(w => Math.max(1, w - 1));
        if (e.key === "]") updateSelectedWidth(w => Math.min(60, w + 1));
      } else if (isDrawActive) {
        if (e.key === "[") setDefaultWidth(w => Math.max(1, w - 1));
        if (e.key === "]") setDefaultWidth(w => Math.min(60, w + 1));
      }

      // Zoom shortcuts
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setViewportScale(s => Math.min(MAX_ZOOM, s * ZOOM_FACTOR));
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setViewportScale(s => Math.max(MIN_ZOOM, s / ZOOM_FACTOR));
      }
      if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setViewportScale(1.0);
        setViewportOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isDrawActive, selectedId, drawingState, deleteLine]);

  const render = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const transform = { scale: viewportScale, offset: viewportOffset };

    // Apply viewport transform
    applyViewportTransform(ctx, transform, dpr);

    // Clear with transform applied
    ctx.clearRect(
      -viewportOffset.x / viewportScale,
      -viewportOffset.y / viewportScale,
      c.width / (viewportScale * dpr),
      c.height / (viewportScale * dpr)
    );

    for (const ln of lines) {
      ctx.lineWidth = ln.width;
      ctx.strokeStyle = ln.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(ln.a.x, ln.a.y);
      ctx.lineTo(ln.b.x, ln.b.y);
      ctx.stroke();

      if (ln.id === selectedId) {
        ctx.lineWidth = ln.width + SELECTION_HIGHLIGHT_WIDTH;
        ctx.strokeStyle = "rgba(37, 99, 235, 0.15)";
        ctx.beginPath();
        ctx.moveTo(ln.a.x, ln.a.y);
        ctx.lineTo(ln.b.x, ln.b.y);
        ctx.stroke();
      }
    }

    // Draw snap indicator (scale size appropriately)
    if (drawingState.snapTarget) {
      ctx.beginPath();
      ctx.arc(
        drawingState.snapTarget.point.x,
        drawingState.snapTarget.point.y,
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

    // Draw rubber-band preview (click-click mode)
    if (isDrawActive && drawingState.phase === 'waiting-for-end' && drawingState.startPoint && drawingState.endPoint) {
      ctx.setLineDash([8 / viewportScale, 6 / viewportScale]);
      ctx.lineWidth = defaultWidth;
      ctx.strokeStyle = "#64748B";
      ctx.beginPath();
      ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
      ctx.lineTo(drawingState.endPoint.x, drawingState.endPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [lines, selectedId, isDrawActive, drawingState, defaultWidth, viewportScale, viewportOffset]);

  // Setup canvas and handle resize
  useEffect(() => {
    const c = canvasRef.current, container = containerRef.current;
    if (!c || !container) return;
    const transform = { scale: viewportScale, offset: viewportOffset };
    setupHiDPICanvas(c, transform);
    const ro = new ResizeObserver(() => {
      const t = { scale: viewportScale, offset: viewportOffset };
      setupHiDPICanvas(c, t);
      render();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [viewportScale, viewportOffset, render]);

  useEffect(() => { render(); }, [render]);

  const hitTest = useCallback((p: Pt): string | null => {
    let best: { id: string; d: number } | null = null;
    for (const ln of lines) {
      const d = distancePointToSegment(p, ln.a, ln.b);
      const tol = Math.max(HIT_TEST_MIN_TOLERANCE, ln.width / HIT_TEST_WIDTH_FACTOR);
      if (d <= tol && (!best || d < best.d)) best = { id: ln.id, d };
    }
    return best?.id ?? null;
  }, [lines]);

  /**
   * Calculate optimal position for Width HUD based on selected line
   * Strategy: Position above line midpoint, flip to below if near top edge
   *
   * Edge Padding Research:
   * - Floating UI default: 5px (shift middleware)
   * - MUI Base: 8px margin for popovers
   * - Industry standard: 8px for floating UI elements
   * Using 8px as it represents the modern design system standard
   */
  const calculateHudPosition = useCallback((lineId: string): { x: number; y: number } | null => {
    const line = lines.find(l => l.id === lineId);
    if (!line) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const hud = hudRef.current;

    // Get canvas bounds (accounts for sidebar)
    const canvasBounds = canvas.getBoundingClientRect();

    // Calculate line midpoint in canvas coordinates
    const midCanvasX = (line.a.x + line.b.x) / 2;
    const midCanvasY = (line.a.y + line.b.y) / 2;

    // Transform to screen coordinates
    const transform = { scale: viewportScale, offset: viewportOffset };
    const midScreen = canvasToScreen(midCanvasX, midCanvasY, transform);

    // Get HUD dimensions (use fallback estimates if not yet rendered)
    const hudWidth = hud?.offsetWidth || 450; // Fallback estimate for new controls
    const hudHeight = hud?.offsetHeight || 50; // Fallback estimate

    // Constants (based on design system research)
    const VERTICAL_OFFSET = 16; // Space between line and HUD
    const EDGE_PADDING = 8; // Industry standard (Floating UI, MUI Base)
    const LINE_CLEARANCE = (line.width * viewportScale) / 2; // Scale line width

    // Calculate initial position (above line, centered horizontally)
    let x = midScreen.x - hudWidth / 2;
    let y = midScreen.y - LINE_CLEARANCE - VERTICAL_OFFSET - hudHeight;

    // Horizontal boundary checks
    if (x < EDGE_PADDING) {
      x = EDGE_PADDING; // Too far left, align to left edge
    } else if (x + hudWidth > canvasBounds.width - EDGE_PADDING) {
      x = canvasBounds.width - hudWidth - EDGE_PADDING; // Too far right
    }

    // Vertical boundary check - flip to below if too close to top
    // Account for bottom bar (60px)
    const maxY = canvasBounds.height - hudHeight - EDGE_PADDING - 60;
    if (y < EDGE_PADDING) {
      // Position below the line instead
      y = midScreen.y + LINE_CLEARANCE + VERTICAL_OFFSET;
    }

    // Constrain vertically
    y = Math.max(EDGE_PADDING, Math.min(y, maxY));

    return { x, y };
  }, [lines, viewportScale, viewportOffset]);

  // Handle first click in drawing mode - set start point
  const handleDrawingFirstClick = useCallback((rawPos: Pt) => {
    const snap = findSnapTarget(rawPos, lines);
    const startPos = resolveSnapPoint(rawPos, snap);

    setSelectedId(null);
    setHudPosition(null);
    drawingState.startDrawing(startPos, snap);
  }, [lines, drawingState]);

  // Handle second click in drawing mode - create line
  const handleDrawingSecondClick = useCallback(() => {
    if (!drawingState.startPoint || !drawingState.endPoint) return;

    if (dist(drawingState.startPoint, drawingState.endPoint) > MIN_LINE_LENGTH) {
      const newLine: Line = {
        id: uid(),
        a: drawingState.startPoint,
        b: drawingState.endPoint,
        width: defaultWidth,
        color: defaultColor
      };
      setLines(prev => [...prev, newLine]);
      setSelectedId(newLine.id);

      // Calculate HUD position for newly created line
      setTimeout(() => {
        const position = calculateHudPosition(newLine.id);
        setHudPosition(position);
      }, 0);
    }

    drawingState.reset();
  }, [drawingState, defaultWidth, defaultColor, calculateHudPosition]);

  // Pan mode detection (right-click only)
  const shouldEnterPanMode = useCallback((e: React.PointerEvent): boolean => {
    return e.button === 2; // Right mouse button
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;

    const transform = { scale: viewportScale, offset: viewportOffset };

    // Check for pan mode (right-click)
    if (shouldEnterPanMode(e)) {
      e.preventDefault();
      setIsPanning(true);
      const rect = c.getBoundingClientRect();
      setPanStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setPanOffsetStart({ ...viewportOffset });
      c.style.cursor = 'grabbing';
      return;
    }

    c.setPointerCapture(e.pointerId);
    const rawPos = getPointerPos(c, e.nativeEvent as any, transform);

    if (isDrawActive) {
      // Click-click drawing logic
      if (drawingState.phase === 'idle') {
        handleDrawingFirstClick(rawPos);
      } else if (drawingState.phase === 'waiting-for-end') {
        handleDrawingSecondClick();
      }
    } else {
      // Selection mode
      const id = hitTest(rawPos);
      setSelectedId(id);

      // Calculate HUD position when line is selected
      if (id) {
        setTimeout(() => {
          const position = calculateHudPosition(id);
          setHudPosition(position);
        }, 0);
      } else {
        setHudPosition(null);
      }

      render();
    }
  }, [
    isDrawActive,
    drawingState,
    handleDrawingFirstClick,
    handleDrawingSecondClick,
    hitTest,
    render,
    calculateHudPosition,
    viewportScale,
    viewportOffset,
    shouldEnterPanMode
  ]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;

    const rect = c.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Handle panning (right-click drag)
    if (isPanning && panStart && panOffsetStart) {
      const deltaX = screenX - panStart.x;
      const deltaY = screenY - panStart.y;
      setViewportOffset({
        x: panOffsetStart.x + deltaX,
        y: panOffsetStart.y + deltaY
      });
      return;
    }

    // Only process snapping when in draw mode
    if (!isDrawActive) return;

    const transform = { scale: viewportScale, offset: viewportOffset };
    const cursorPos = screenToCanvas(screenX, screenY, transform);

    // Find and update snap target for visual feedback
    const snap = findSnapTarget(cursorPos, lines);
    drawingState.setSnapTarget(snap);

    // Update draft line endpoint when actively drawing
    const isActivelyDrawing = drawingState.phase === 'waiting-for-end' && drawingState.startPoint;
    if (isActivelyDrawing) {
      const endPos = resolveSnapPoint(cursorPos, snap);
      drawingState.updateEndPoint(endPos, snap);
    }
  }, [
    isDrawActive,
    drawingState,
    lines,
    isPanning,
    panStart,
    panOffsetStart,
    viewportScale,
    viewportOffset
  ]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;

    // Handle pan end
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      setPanOffsetStart(null);
      c.style.cursor = isDrawActive ? 'crosshair' : 'default';
      return;
    }

    try { c.releasePointerCapture(e.pointerId); } catch {}
    // Note: Line creation now happens in onPointerDown (second click)
    // This handler just cleans up pointer capture
  }, [isPanning, isDrawActive]);

  const updateSelectedWidth = useCallback((fn: (w: number) => number) => {
    if (!selectedId) return;
    setLines(prev => prev.map(l => l.id === selectedId ? { ...l, width: fn(l.width) } : l));
  }, [selectedId]);

  // Width input handlers for increment/decrement controls
  const incrementWidth = useCallback(() => {
    updateSelectedWidth(w => Math.min(60, w + 1));
  }, [updateSelectedWidth]);

  const decrementWidth = useCallback(() => {
    updateSelectedWidth(w => Math.max(1, w - 1));
  }, [updateSelectedWidth]);

  const handleWidthInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string for user to clear and retype
    if (value === '') {
      return;
    }

    // Parse as integer
    const numValue = parseInt(value, 10);

    // Validate: must be a number and within range
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 60) {
      updateSelectedWidth(() => numValue);
    }
  }, [updateSelectedWidth]);

  const handleWidthInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);

    // If empty or invalid, reset to current width
    if (value === '' || isNaN(numValue)) {
      const currentWidth = lines.find(l => l.id === selectedId)?.width ?? 8;
      e.target.value = currentWidth.toString();
    } else {
      // Clamp to valid range
      const clampedValue = Math.max(1, Math.min(60, numValue));
      updateSelectedWidth(() => clampedValue);
    }
  }, [updateSelectedWidth, selectedId, lines]);

  // Calculate line summary for sidebar table
  const lineSummary = useMemo((): LineSummaryRow[] => {
    const grouped = new Map<number, { count: number; totalPixels: number; lineIds: string[] }>();

    for (const line of lines) {
      const pixelLength = Math.sqrt(
        Math.pow(line.b.x - line.a.x, 2) + Math.pow(line.b.y - line.a.y, 2)
      );

      const existing = grouped.get(line.width);
      if (existing) {
        existing.count++;
        existing.totalPixels += pixelLength;
        existing.lineIds.push(line.id);
      } else {
        grouped.set(line.width, { count: 1, totalPixels: pixelLength, lineIds: [line.id] });
      }
    }

    const rows: LineSummaryRow[] = [];
    grouped.forEach((data, width) => {
      const totalInches = pixelsToInches(data.totalPixels, currentScale);
      rows.push({
        width,
        widthDisplay: `${width}"`,
        count: data.count,
        totalLength: totalInches,
        totalLengthDisplay: formatLength(totalInches, currentScale.unit),
        lineIds: data.lineIds
      });
    });

    // Sort by width (ascending)
    return rows.sort((a, b) => a.width - b.width);
  }, [lines, currentScale]);

  useEffect(() => { render(); }, [lines, drawingState, selectedId, render]);

  // Recalculate HUD position when lines change (e.g., width updated)
  useEffect(() => {
    if (!selectedId) return;
    const position = calculateHudPosition(selectedId);
    setHudPosition(position);
  }, [selectedId, lines, calculateHudPosition]);

  // Recalculate HUD position on window resize
  useEffect(() => {
    if (!selectedId) return;

    const handleResize = () => {
      const position = calculateHudPosition(selectedId);
      setHudPosition(position);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedId, calculateHudPosition]);

  // Mouse wheel zoom handler
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); // Prevent page scroll

    const c = canvasRef.current;
    if (!c) return;

    const rect = c.getBoundingClientRect();
    const mouseScreenX = e.clientX - rect.left;
    const mouseScreenY = e.clientY - rect.top;

    // Calculate zoom direction and factor
    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

    // Calculate new scale with constraints
    const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewportScale * zoomFactor));

    if (newScale === viewportScale) return; // At zoom limit

    // Get mouse position in canvas space (before zoom)
    const mouseCanvasX = (mouseScreenX - viewportOffset.x) / viewportScale;
    const mouseCanvasY = (mouseScreenY - viewportOffset.y) / viewportScale;

    // Calculate new offset to keep mouse position fixed
    const newOffsetX = mouseScreenX - mouseCanvasX * newScale;
    const newOffsetY = mouseScreenY - mouseCanvasY * newScale;

    setViewportScale(newScale);
    setViewportOffset({ x: newOffsetX, y: newOffsetY });
  }, [viewportScale, viewportOffset]);

  // Prevent context menu (right-click)
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Touch gesture handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      setTouchStartDistance(distance);
      setTouchStartScale(viewportScale);
      setTouchStartOffset({ ...viewportOffset });
    }
  }, [viewportScale, viewportOffset]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistance !== null) {
      e.preventDefault();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scaleFactor = currentDistance / touchStartDistance;
      const newScale = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, touchStartScale * scaleFactor)
      );

      // Calculate midpoint between touches (zoom center)
      const c = canvasRef.current;
      if (!c) return;

      const rect = c.getBoundingClientRect();
      const midX = ((touch1.clientX + touch2.clientX) / 2) - rect.left;
      const midY = ((touch1.clientY + touch2.clientY) / 2) - rect.top;

      // Get midpoint in canvas space
      const midCanvasX = (midX - touchStartOffset!.x) / touchStartScale;
      const midCanvasY = (midY - touchStartOffset!.y) / touchStartScale;

      // Calculate new offset to keep midpoint fixed
      const newOffsetX = midX - midCanvasX * newScale;
      const newOffsetY = midY - midCanvasY * newScale;

      setViewportScale(newScale);
      setViewportOffset({ x: newOffsetX, y: newOffsetY });
    }
  }, [touchStartDistance, touchStartScale, touchStartOffset]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setTouchStartDistance(null);
      setTouchStartScale(1.0);
      setTouchStartOffset(null);
    }
  }, []);

  const sidebarWidth = sidebarCollapsed ? 0 : 320;

  // Zoom control handlers for BottomBar
  const handleZoomIn = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = Math.min(MAX_ZOOM, viewportScale * ZOOM_FACTOR);
    const mouseCanvas = screenToCanvas(centerX, centerY, { scale: viewportScale, offset: viewportOffset });
    const newOffset = {
      x: centerX - mouseCanvas.x * newScale,
      y: centerY - mouseCanvas.y * newScale,
    };
    setViewportScale(newScale);
    setViewportOffset(newOffset);
  }, [viewportScale, viewportOffset]);

  const handleZoomOut = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = Math.max(MIN_ZOOM, viewportScale / ZOOM_FACTOR);
    const mouseCanvas = screenToCanvas(centerX, centerY, { scale: viewportScale, offset: viewportOffset });
    const newOffset = {
      x: centerX - mouseCanvas.x * newScale,
      y: centerY - mouseCanvas.y * newScale,
    };
    setViewportScale(newScale);
    setViewportOffset(newOffset);
  }, [viewportScale, viewportOffset]);

  const handleResetZoom = useCallback(() => {
    setViewportScale(1.0);
    setViewportOffset({ x: 0, y: 0 });
  }, []);

  const canZoomIn = viewportScale < MAX_ZOOM;
  const canZoomOut = viewportScale > MIN_ZOOM;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex">
      <TechBlueTokens />

      {/* Canvas Container with Canvas Element */}
      <CanvasRenderer
        canvasRef={canvasRef}
        containerRef={containerRef}
        isDrawActive={isDrawActive}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        sidebarWidth={sidebarWidth}
      >
        {/* Enhanced Width HUD - positioned inside canvas container */}
        {selectedId && hudPosition && (
          <div
            ref={hudRef}
            className="absolute rounded-2xl shadow-md border border-neutral-200 bg-white/95 backdrop-blur px-4 py-2 flex items-center gap-3 transition-all duration-200 ease-out"
            style={{
              left: `${hudPosition.x}px`,
              top: `${hudPosition.y}px`,
            }}
          >
            <span className="text-sm text-neutral-700">Width</span>

            {/* Decrement Button */}
            <button
              type="button"
              onClick={decrementWidth}
              disabled={lines.find(l => l.id === selectedId)?.width === 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease width"
              title="Decrease width (or press [)"
            >
              <ChevronDown className="w-4 h-4 text-neutral-700" />
            </button>

            {/* Number Input Field */}
            <input
              type="number"
              min={1}
              max={60}
              value={lines.find(l => l.id === selectedId)?.width ?? 8}
              onChange={handleWidthInputChange}
              onBlur={handleWidthInputBlur}
              className="w-16 px-2 py-1 text-center text-sm border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-600)] focus:border-transparent tabular-nums transition-shadow"
              aria-label="Line width value"
              title="Enter width (1-60)"
            />

            {/* Increment Button */}
            <button
              type="button"
              onClick={incrementWidth}
              disabled={lines.find(l => l.id === selectedId)?.width === 60}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase width"
              title="Increase width (or press ])"
            >
              <ChevronUp className="w-4 h-4 text-neutral-700" />
            </button>

            {/* Display unit */}
            <span className="w-10 text-right tabular-nums text-sm text-neutral-800">
              {(lines.find(l => l.id === selectedId)?.width ?? 8)}px
            </span>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteLine(selectedId)}
              className="ml-2 px-2 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
              aria-label="Delete selected line"
            >
              Delete
            </button>
          </div>
        )}

        {/* Draw Mode Toggle Button */}
        <DrawButton
          isActive={isDrawActive}
          onToggle={() => setIsDrawActive(v => !v)}
          sidebarWidth={sidebarWidth}
        />
      </CanvasRenderer>

      {/* Sidebar with Toggle Button */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        lineSummary={lineSummary}
        currentScale={currentScale}
        width={320}
      />

      {/* Bottom Bar - Zoom Controls */}
      <BottomBar
        zoom={viewportScale}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />
    </div>
  );
}

function distancePointToSegment(p: Pt, a: Pt, b: Pt): number {
  const abx = b.x - a.x, aby = b.y - a.y;
  const apx = p.x - a.x, apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return Math.hypot(apx, apy);
  let t = (apx * abx + apy * aby) / ab2; t = Math.max(0, Math.min(1, t));
  const cx = a.x + t * abx, cy = a.y + t * aby;
  return Math.hypot(p.x - cx, p.y - cy);
}
