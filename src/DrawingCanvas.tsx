import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Pencil, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

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
  <style>{`
    :root {
      --tech-blue-300: #60A5FA;
      --tech-blue-500: #3B82F6;
      --tech-blue-600: #2563EB;
      --tech-blue-700: #1D4ED8;
    }
  `}</style>
);

// Geometry helpers
type Pt = { x: number; y: number };
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

function getPointerPos(canvas: HTMLCanvasElement, evt: PointerEvent | React.PointerEvent) {
  const r = canvas.getBoundingClientRect();
  return { x: evt.clientX - r.left, y: evt.clientY - r.top };
}

function setupHiDPICanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.floor(cssW));
  const h = Math.max(1, Math.floor(cssH));
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Model
type Line = {
  id: string;
  a: Pt; // start
  b: Pt; // end
  width: number; // visual line width in px (duct centerline proxy)
  color: string; // stroke color
};

// Snap system types
type SnapType = 'endpoint' | 'midpoint' | 'line';

type SnapTarget = {
  lineId: string;      // Which line we're snapping to
  point: Pt;           // Exact snap coordinates
  type: SnapType;      // What kind of snap point
  distance: number;    // Distance from cursor to snap point
};

// Drawing phase for click-click interaction
type DrawingPhase = 'idle' | 'waiting-for-end';

// Scale system types
type ScaleUnit = 'imperial' | 'metric';
type ScaleType = 'custom' | 'architectural' | 'engineering' | 'metric';

type Scale = {
  type: ScaleType;
  pixelsPerInch: number;  // Conversion factor: realInches = pixels / pixelsPerInch
  displayName: string;    // e.g., "1/4\" = 1'-0\"" or "1:50"
  unit: ScaleUnit;
};

// Line summary types
type LineSummaryRow = {
  width: number;              // Width in pixels
  widthDisplay: string;       // Formatted width (e.g., "8\"")
  count: number;              // Number of lines with this width
  totalLength: number;        // Total length in inches
  totalLengthDisplay: string; // Formatted length (e.g., "28'-6\"")
  lineIds: string[];          // Array of line IDs (stored, not displayed)
};

function uid() { return Math.random().toString(36).slice(2, 9); }

// Predefined scales database
const ARCHITECTURAL_SCALES: Scale[] = [
  { type: 'architectural', pixelsPerInch: 1/192, displayName: '1/16" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/96, displayName: '1/8" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/48, displayName: '1/4" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/24, displayName: '1/2" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/16, displayName: '3/4" = 1\'-0"', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/12, displayName: '1" = 1\'-0"', unit: 'imperial' },
];

const ENGINEERING_SCALES: Scale[] = [
  { type: 'engineering', pixelsPerInch: 1/120, displayName: '1" = 10\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/240, displayName: '1" = 20\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/360, displayName: '1" = 30\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/480, displayName: '1" = 40\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/600, displayName: '1" = 50\'', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/720, displayName: '1" = 60\'', unit: 'imperial' },
];

const METRIC_SCALES: Scale[] = [
  { type: 'metric', pixelsPerInch: 1, displayName: '1:1', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/5, displayName: '1:5', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/10, displayName: '1:10', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/20, displayName: '1:20', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/50, displayName: '1:50', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/100, displayName: '1:100', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/200, displayName: '1:200', unit: 'metric' },
  { type: 'metric', pixelsPerInch: 1/500, displayName: '1:500', unit: 'metric' },
];

// Scale conversion helpers
function pixelsToInches(pixels: number, scale: Scale): number {
  return pixels / scale.pixelsPerInch;
}

function formatLength(inches: number, unit: ScaleUnit): string {
  if (unit === 'imperial') {
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round((inches % 12) * 10) / 10;
    if (feet > 0) {
      if (remainingInches > 0) {
        return `${feet}'-${remainingInches}"`;
      }
      return `${feet}'-0"`;
    }
    return `${remainingInches}"`;
  } else {
    // Metric: convert inches to cm
    const cm = inches * 2.54;
    if (cm >= 100) {
      return `${(cm / 100).toFixed(2)} m`;
    }
    return `${cm.toFixed(1)} cm`;
  }
}

// Snap detection helpers
function getClosestPointOnSegment(p: Pt, a: Pt, b: Pt): Pt {
  const abx = b.x - a.x, aby = b.y - a.y;
  const apx = p.x - a.x, apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return a; // Segment is a point
  let t = (apx * abx + apy * aby) / ab2;
  t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
  return { x: a.x + t * abx, y: a.y + t * aby };
}

// Snap thresholds (pixels)
const SNAP_THRESHOLD_ENDPOINT = 20;
const SNAP_THRESHOLD_MIDPOINT = 18;
const SNAP_THRESHOLD_LINE = 15;

// Snap indicator visuals
const SNAP_INDICATOR_RADIUS = 7;
const SNAP_INDICATOR_COLOR = '#06B6D4'; // cyan
const SNAP_INDICATOR_FILL = 'rgba(6, 182, 212, 0.3)';

// Drawing interaction constants
const MIN_LINE_LENGTH = 2;           // Minimum line length in pixels to create
const SELECTION_HIGHLIGHT_WIDTH = 8;  // Additional width for selection highlight
const HIT_TEST_MIN_TOLERANCE = 6;    // Minimum hit test tolerance in pixels
const HIT_TEST_WIDTH_FACTOR = 1.5;   // Factor to calculate tolerance from line width

/**
 * Resolves the final point to use, applying snap if available
 * @param rawPoint - The raw cursor position
 * @param snapTarget - The snap target (if any)
 * @returns The final point (snapped or raw)
 */
function resolveSnapPoint(rawPoint: Pt, snapTarget: SnapTarget | null): Pt {
  return snapTarget ? snapTarget.point : rawPoint;
}

function findSnapTarget(
  cursor: Pt,
  lines: Line[],
  excludeLineId?: string
): SnapTarget | null {
  const candidates: SnapTarget[] = [];

  for (const line of lines) {
    if (line.id === excludeLineId) continue;

    // Check endpoint A (20px threshold)
    const distToA = dist(cursor, line.a);
    if (distToA <= SNAP_THRESHOLD_ENDPOINT) {
      candidates.push({
        lineId: line.id,
        point: line.a,
        type: 'endpoint',
        distance: distToA
      });
    }

    // Check endpoint B (20px threshold)
    const distToB = dist(cursor, line.b);
    if (distToB <= SNAP_THRESHOLD_ENDPOINT) {
      candidates.push({
        lineId: line.id,
        point: line.b,
        type: 'endpoint',
        distance: distToB
      });
    }

    // Check midpoint (18px threshold)
    const midpoint = {
      x: (line.a.x + line.b.x) / 2,
      y: (line.a.y + line.b.y) / 2
    };
    const distToMid = dist(cursor, midpoint);
    if (distToMid <= SNAP_THRESHOLD_MIDPOINT) {
      candidates.push({
        lineId: line.id,
        point: midpoint,
        type: 'midpoint',
        distance: distToMid
      });
    }

    // Check any point on line (15px threshold)
    const closestPoint = getClosestPointOnSegment(cursor, line.a, line.b);
    const distToLine = dist(cursor, closestPoint);
    if (distToLine <= SNAP_THRESHOLD_LINE) {
      candidates.push({
        lineId: line.id,
        point: closestPoint,
        type: 'line',
        distance: distToLine
      });
    }
  }

  // Return closest candidate overall
  if (candidates.length === 0) return null;
  return candidates.reduce((closest, current) =>
    current.distance < closest.distance ? current : closest
  );
}

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

  useEffect(() => {
    const c = canvasRef.current, container = containerRef.current;
    if (!c || !container) return;
    setupHiDPICanvas(c);
    const ro = new ResizeObserver(() => { setupHiDPICanvas(c); render(); });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

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
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isDrawActive, selectedId, drawingState, deleteLine]);

  const render = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);

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

    // Draw snap indicator
    if (drawingState.snapTarget) {
      ctx.beginPath();
      ctx.arc(drawingState.snapTarget.point.x, drawingState.snapTarget.point.y, SNAP_INDICATOR_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = SNAP_INDICATOR_FILL;
      ctx.fill();
      ctx.strokeStyle = SNAP_INDICATOR_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw rubber-band preview (click-click mode)
    if (isDrawActive && drawingState.phase === 'waiting-for-end' && drawingState.startPoint && drawingState.endPoint) {
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = defaultWidth;
      ctx.strokeStyle = "#64748B";
      ctx.beginPath();
      ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
      ctx.lineTo(drawingState.endPoint.x, drawingState.endPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [lines, selectedId, isDrawActive, drawingState, defaultWidth]);

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
    const midX = (line.a.x + line.b.x) / 2;
    const midY = (line.a.y + line.b.y) / 2;

    // Get HUD dimensions (use fallback estimates if not yet rendered)
    const hudWidth = hud?.offsetWidth || 450; // Fallback estimate for new controls
    const hudHeight = hud?.offsetHeight || 50; // Fallback estimate

    // Constants (based on design system research)
    const VERTICAL_OFFSET = 16; // Space between line and HUD
    const EDGE_PADDING = 8; // Industry standard (Floating UI, MUI Base)
    const LINE_CLEARANCE = line.width / 2; // Half of line width

    // Calculate initial position (above line, centered horizontally)
    let x = midX - hudWidth / 2;
    let y = midY - LINE_CLEARANCE - VERTICAL_OFFSET - hudHeight;

    // Horizontal boundary checks
    if (x < EDGE_PADDING) {
      x = EDGE_PADDING; // Too far left, align to left edge
    } else if (x + hudWidth > canvasBounds.width - EDGE_PADDING) {
      x = canvasBounds.width - hudWidth - EDGE_PADDING; // Too far right
    }

    // Vertical boundary check - flip to below if too close to top
    if (y < EDGE_PADDING) {
      // Position below the line instead
      y = midY + LINE_CLEARANCE + VERTICAL_OFFSET;

      // If still doesn't fit, clamp to edge
      if (y + hudHeight > canvasBounds.height - EDGE_PADDING) {
        y = EDGE_PADDING; // Fallback: position at top edge
      }
    }

    return { x, y };
  }, [lines]);

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

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;
    c.setPointerCapture(e.pointerId);
    const rawPos = getPointerPos(c, e.nativeEvent as any);

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
  }, [isDrawActive, drawingState, handleDrawingFirstClick, handleDrawingSecondClick, hitTest, render, calculateHudPosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;

    // Only process snapping when in draw mode
    if (!isDrawActive) return;

    const cursorPos = getPointerPos(c, e.nativeEvent as any);

    // Find and update snap target for visual feedback
    const snap = findSnapTarget(cursorPos, lines);
    drawingState.setSnapTarget(snap);

    // Update draft line endpoint when actively drawing
    const isActivelyDrawing = drawingState.phase === 'waiting-for-end' && drawingState.startPoint;
    if (isActivelyDrawing) {
      const endPos = resolveSnapPoint(cursorPos, snap);
      drawingState.updateEndPoint(endPos, snap);
    }
  }, [isDrawActive, drawingState, lines]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;
    try { c.releasePointerCapture(e.pointerId); } catch {}
    // Note: Line creation now happens in onPointerDown (second click)
    // This handler just cleans up pointer capture
  }, []);

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

  const sidebarWidth = sidebarCollapsed ? 0 : 320;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex">
      <TechBlueTokens />

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{ width: `calc(100% - ${sidebarWidth}px)` }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 bg-white ${isDrawActive ? "cursor-crosshair" : "cursor-default"}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Drawing canvas"
          role="img"
        />

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

        <button
          type="button"
          aria-label={isDrawActive ? "Disable Draw tool" : "Enable Draw tool"}
          aria-pressed={isDrawActive}
          title="Toggle Draw (D)"
          onClick={() => setIsDrawActive(v => !v)}
          className={[
            "group select-none fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg focus:outline-none",
            "ring-2",
            isDrawActive
              ? "bg-[var(--tech-blue-600)] ring-[var(--tech-blue-300)] hover:bg-[var(--tech-blue-700)]"
              : "bg-white ring-neutral-200 hover:ring-neutral-300",
            "flex items-center justify-center transition-colors"
          ].join(" ")}
          style={{ right: `${sidebarWidth + 24}px` }}
        >
          <Pencil className={[
            "transition-transform",
            isDrawActive ? "scale-110 text-white" : "text-neutral-700 group-hover:text-neutral-900"
          ].join(" ")} />
        </button>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        type="button"
        onClick={() => setSidebarCollapsed(v => !v)}
        className="fixed top-0 bottom-0 w-6 bg-neutral-200 hover:bg-neutral-300 transition-colors flex items-center justify-center z-10"
        style={{ right: `${sidebarWidth}px` }}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronLeft className="w-4 h-4 text-neutral-700" />
        ) : (
          <ChevronRight className="w-4 h-4 text-neutral-700" />
        )}
      </button>

      {/* Sidebar */}
      {!sidebarCollapsed && (
        <div
          className="h-full bg-white border-l border-neutral-200 flex flex-col"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-800">Line Summary</h2>
            <p className="text-xs text-neutral-500 mt-1">Scale: {currentScale.displayName}</p>
          </div>

          {/* Summary Table */}
          <div className="flex-1 overflow-auto p-4">
            {lineSummary.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center mt-8">No lines drawn yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-2 text-neutral-700 font-medium">Count</th>
                    <th className="text-left py-2 px-2 text-neutral-700 font-medium">Size</th>
                    <th className="text-right py-2 px-2 text-neutral-700 font-medium">Total Length</th>
                  </tr>
                </thead>
                <tbody>
                  {lineSummary.map((row) => (
                    <tr key={row.width} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-2 px-2 text-neutral-800">{row.count}</td>
                      <td className="py-2 px-2 text-neutral-800">{row.widthDisplay}</td>
                      <td className="py-2 px-2 text-right text-neutral-800 tabular-nums">{row.totalLengthDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
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
