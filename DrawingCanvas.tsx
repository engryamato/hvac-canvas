import React, { useEffect, useRef, useState, useCallback } from "react";
import { Pencil } from "lucide-react";

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

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function DrawingCanvasWithFAB() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Tool/UI state
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftStart, setDraftStart] = useState<Pt | null>(null); // when drawing, stores mouse-down point
  const [draftEnd, setDraftEnd] = useState<Pt | null>(null); // live rubber-band end

  // Default style (you might later expose these as pickers)
  const [defaultWidth, setDefaultWidth] = useState(8);
  const [defaultColor] = useState("#111827");

  // Resize handling
  useEffect(() => {
    const c = canvasRef.current, container = containerRef.current;
    if (!c || !container) return;
    setupHiDPICanvas(c);
    const ro = new ResizeObserver(() => { setupHiDPICanvas(c); render(); });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d") setIsDrawActive(v => !v);
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
  }, [isDrawActive, selectedId]);

  // Render all content
  const render = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);

    // draw stored lines
    for (const ln of lines) {
      ctx.lineWidth = ln.width;
      ctx.strokeStyle = ln.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(ln.a.x, ln.a.y);
      ctx.lineTo(ln.b.x, ln.b.y);
      ctx.stroke();

      // selection halo
      if (ln.id === selectedId) {
        ctx.lineWidth = ln.width + 8; // soft halo
        ctx.strokeStyle = "rgba(37, 99, 235, 0.15)"; // tech blue 600 @ 15%
        ctx.beginPath();
        ctx.moveTo(ln.a.x, ln.a.y);
        ctx.lineTo(ln.b.x, ln.b.y);
        ctx.stroke();
      }
    }

    // rubber-band draft
    if (isDrawActive && draftStart && draftEnd) {
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = defaultWidth;
      ctx.strokeStyle = "#64748B"; // slate-500 dashed preview
      ctx.beginPath();
      ctx.moveTo(draftStart.x, draftStart.y);
      ctx.lineTo(draftEnd.x, draftEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [lines, selectedId, isDrawActive, draftStart, draftEnd, defaultWidth]);

  useEffect(() => { render(); }, [render]);

  // Hit-test distance from point to segment
  const hitTest = useCallback((p: Pt): string | null => {
    let best: { id: string; d: number } | null = null;
    for (const ln of lines) {
      const d = distancePointToSegment(p, ln.a, ln.b);
      const tol = Math.max(6, ln.width / 1.5); // tolerance grows with width
      if (d <= tol && (!best || d < best.d)) best = { id: ln.id, d };
    }
    return best?.id ?? null;
  }, [lines]);

  // Pointer handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;
    c.setPointerCapture(e.pointerId);
    const p = getPointerPos(c, e.nativeEvent);

    if (isDrawActive) {
      // start new draft
      setSelectedId(null); // deselect while drafting
      setDraftStart(p);
      setDraftEnd(null);
    } else {
      // selection mode
      const id = hitTest(p);
      setSelectedId(id);
      render();
    }
  }, [isDrawActive, hitTest, render]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;
    if (!isDrawActive || !draftStart) return;
    const p = getPointerPos(c, e.nativeEvent);
    setDraftEnd(p);
  }, [isDrawActive, draftStart]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;
    try { c.releasePointerCapture(e.pointerId); } catch {}

    if (isDrawActive && draftStart && draftEnd) {
      // Ignore zero-length drags
      if (dist(draftStart, draftEnd) > 2) {
        const newLine: Line = { id: uid(), a: draftStart, b: draftEnd, width: defaultWidth, color: defaultColor };
        setLines(prev => [...prev, newLine]);
        setSelectedId(newLine.id); // auto-select the new line to allow width adjustments
      }
    }
    setDraftStart(null); setDraftEnd(null);
  }, [isDrawActive, draftStart, draftEnd, defaultWidth, defaultColor]);

  // Selection width update helper
  const updateSelectedWidth = (fn: (w: number) => number) => {
    if (!selectedId) return;
    setLines(prev => prev.map(l => l.id === selectedId ? { ...l, width: fn(l.width) } : l));
  };

  // Also re-render when lines or draft updates
  useEffect(() => { render(); }, [lines, draftStart, draftEnd, selectedId, render]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden">
      <TechBlueTokens />

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

      {/* Width HUD — only when a line is selected */}
      {selectedId && (
        <div className="absolute top-3 left-3 rounded-2xl shadow-md border border-neutral-200 bg-white/95 backdrop-blur px-4 py-2 flex items-center gap-3">
          <span className="text-sm text-neutral-700">Width</span>
          <input
            type="range"
            min={1}
            max={60}
            value={lines.find(l => l.id === selectedId)?.width ?? 8}
            onChange={(e) => updateSelectedWidth(() => Number(e.target.value))}
            className="accent-[var(--tech-blue-600)]"
            aria-label="Selected line width"
          />
          <span className="w-10 text-right tabular-nums text-sm text-neutral-800">
            {(lines.find(l => l.id === selectedId)?.width ?? 8)}px
          </span>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
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
      >
        <Pencil className={[
          "transition-transform",
          isDrawActive ? "scale-110 text-white" : "text-neutral-700 group-hover:text-neutral-900"
        ].join(" ")} />
      </button>
    </div>
  );
}

// Distance from point P to segment AB
function distancePointToSegment(p: Pt, a: Pt, b: Pt): number {
  const abx = b.x - a.x, aby = b.y - a.y;
  const apx = p.x - a.x, apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return Math.hypot(apx, apy);
  let t = (apx * abx + apy * aby) / ab2; t = Math.max(0, Math.min(1, t));
  const cx = a.x + t * abx, cy = a.y + t * aby;
  return Math.hypot(p.x - cx, p.y - cy);
}

/* ------------------------------- FULL SCREEN UPDATE -------------------------------
Key Changes:
1. Container div now uses: `fixed inset-0 w-screen h-screen overflow-hidden`
   - `fixed inset-0` makes it cover the entire viewport
   - `w-screen h-screen` ensures 100vw × 100vh coverage
   - `overflow-hidden` prevents scrollbars

2. Removed className prop - component is now always full-screen

3. Drawing scale is maintained on resize:
   - setupHiDPICanvas reads CSS dimensions and applies devicePixelRatio
   - ResizeObserver detects viewport changes and re-renders
   - Lines are stored in logical coordinates (CSS pixels)
   - When screen resizes, lines are redrawn at same scale with more/less canvas space

Usage:
Simply render <DrawingCanvasWithFAB /> and it will fill the entire screen.
All drawing functionality remains identical to the previous version.
---------------------------------------------------------------------------- */

