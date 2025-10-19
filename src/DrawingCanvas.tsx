import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

import type { Pt, Line, Scale, LineSummaryRow, PdfState } from "./types";

import {
  ARCHITECTURAL_SCALES,
  ENGINEERING_SCALES,
  METRIC_SCALES,
  CSSTokens,
  ZOOM_FACTOR,
  MIN_ZOOM,
  MAX_ZOOM,
} from "./constants";

import {
  screenToCanvas,
  getPointerPos,
  findSnapTarget,
  resolveSnapPoint,
  pixelsToInches,
  formatLength,
  setupHiDPICanvas,
} from "./utils";

import {
  loadPdfFile,
  renderPdfPage,
  drawPdfOnCanvas,
} from "./utils/pdf/pdfLoader";

import {
  addLine,
  removeLines,
  createLine,
  initializeLineDefaults,
  updateLineProperties,
  batchUpdateLines,
  findLineHit,
  findLineById,
  findEndpointHit,
  drawLines,
  drawSnapIndicator,
  drawDraftLine,
  duplicateLine,
  updateLineWidthInCollection,
  updateLineLength,
} from "./services";

import {
  useDrawingState,
  useCanvasSetup,
  useKeyboardShortcuts,
  useViewportTransform,
  useLineStore,
} from "./hooks";

import {
  DrawButton,
  Sidebar,
  BottomBar,
  CanvasRenderer,
} from "./components";
import { LinePropertiesModal } from "./components/LinePropertiesModal";

/**
 * Drawing Canvas + FAB — Straight-Line (HVAC prep) Edition — FULL SCREEN
 * -----------------------------------------------------------------------
 * Changes from previous version:
 * - Canvas now covers the ENTIRE screen (100vw × 100vh)
 * - Automatically adjusts when screen/window is resized
 * - Drawn lines maintain their scale - only the canvas viewport adjusts
 * - All other functionality remains the same (straight segments, width editing, etc.)
 */

export default function DrawingCanvasWithFAB() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Tool/UI state
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  // Selection state - supports both single and multi-select
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTriggerRef = useRef<HTMLElement | null>(null);

  // E2E Testing Support: Expose helper functions for tests
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get all line IDs
      (window as any).__test__getLineIds = () => lines.map(l => l.id);

      // Select a line (with optional multi-select)
      (window as any).__test__selectLine = (lineId: string, multiSelect: boolean) => {
        // Directly manipulate state for testing
        if (multiSelect) {
          setSelectedLineIds(prev => {
            if (prev.includes(lineId)) {
              const newSelection = prev.filter(id => id !== lineId);
              if (newSelection.length === 0) {
                setIsModalOpen(false);
              }
              return newSelection;
            } else {
              return [...prev, lineId];
            }
          });
          setIsModalOpen(true);
        } else {
          setSelectedLineIds([lineId]);
          setIsModalOpen(true);
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__test__getLineIds;
        delete (window as any).__test__selectLine;
      }
    };
  }, [lines]);

  // Legacy selectedId for backward compatibility during transition
  const selectedId = selectedLineIds.length === 1 ? selectedLineIds[0] : null;

  // Drawing state (consolidated via custom hook)
  const drawingState = useDrawingState();

  // Combined scale options for dropdown
  const allScaleOptions = useMemo(() => [
    ...ARCHITECTURAL_SCALES,
    ...ENGINEERING_SCALES,
    ...METRIC_SCALES,
  ], []);

  // Scale management state - Default: 64 pixels = 1 inch (custom conversion, not in dropdown)
  const [currentScale, setCurrentScale] = useState<Scale>({
    type: 'custom',
    pixelsPerInch: 64,
    displayName: 'Custom (64px = 1")',
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

  // Endpoint dragging state
  const [draggingEndpoint, setDraggingEndpoint] = useState<{
    lineId: string;
    endpoint: 'a' | 'b';
  } | null>(null);

  // Touch gesture state
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [touchStartScale, setTouchStartScale] = useState(1.0);
  const [touchStartOffset, setTouchStartOffset] = useState<Pt | null>(null);

  // PDF state
  const [pdfState, setPdfState] = useState<PdfState | null>(null);
  const [pdfOpacity, setPdfOpacity] = useState(0.5);

  // Helper functions (deleteLine removed - now handled by handleLineDelete)

  // Clear snap target when exiting draw mode
  useEffect(() => {
    if (!isDrawActive) {
      drawingState.setSnapTarget(null);
    }
  }, [isDrawActive, drawingState]);

  // Old keyboard handler removed - now using handleKeyDown below with modal support

  const render = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;

    // Defensive checks
    if (viewportScale <= 0) {
      console.warn('Invalid viewport scale:', viewportScale);
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    // Note: Viewport transform is already applied by setupHiDPICanvas()
    // Do NOT call applyViewportTransform() here to avoid double transformation

    // Clear with transform applied
    try {
      ctx.clearRect(
        -viewportOffset.x / viewportScale,
        -viewportOffset.y / viewportScale,
        c.width / (viewportScale * dpr),
        c.height / (viewportScale * dpr)
      );
    } catch (error) {
      console.error('Error clearing canvas:', error);
      return;
    }

    // Draw PDF as background layer (if loaded)
    if (pdfState && pdfState.imageData) {
      drawPdfOnCanvas(
        ctx,
        pdfState.imageData,
        pdfState.offset.x,
        pdfState.offset.y,
        pdfState.width,
        pdfState.height,
        pdfState.opacity
      );
    }

    if (lines.length > 0) {
      drawLines(ctx, lines, {
        selectedLineIds,
        viewportScale,
      });
    }

    if (drawingState.snapTarget) {
      drawSnapIndicator(ctx, drawingState.snapTarget, viewportScale);
    }

    if (
      isDrawActive &&
      drawingState.phase === 'waiting-for-end' &&
      drawingState.startPoint &&
      drawingState.endPoint
    ) {
      drawDraftLine(
        ctx,
        drawingState.startPoint,
        drawingState.endPoint,
        defaultWidth,
        viewportScale
      );
    }
  }, [lines, selectedLineIds, isDrawActive, drawingState, defaultWidth, viewportScale, pdfState]);

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
    return findLineHit(lines, p);
  }, [lines]);

  // Check if cursor is near an endpoint of a line
  const hitTestEndpoint = useCallback((p: Pt, lineId: string): 'a' | 'b' | null => {
    const line = findLineById(lines, lineId);
    if (!line) return null;

    return findEndpointHit(line, p);
  }, [lines]);

  // calculateHudPosition removed - now using useModalPosition hook in LinePropertiesModal

  /**
   * Get selected lines as Line objects
   *
   * @returns Array of selected Line objects
   */
  const getSelectedLines = useCallback((): Line[] => {
    return selectedLineIds
      .map(id => lines.find(l => l.id === id))
      .filter((line): line is Line => line !== undefined);
  }, [selectedLineIds, lines]);

  /**
   * Handle line selection (single or multi-select)
   *
   * @param lineId - ID of the line to select
   * @param isShiftClick - Whether Shift key was pressed (for multi-select)
   */
  const handleLineSelection = useCallback((lineId: string, isShiftClick: boolean) => {
    if (isShiftClick) {
      // Multi-select: toggle line in selection
      setSelectedLineIds(prev => {
        if (prev.includes(lineId)) {
          // Remove from selection
          const newSelection = prev.filter(id => id !== lineId);
          if (newSelection.length === 0) {
            setIsModalOpen(false);
          }
          return newSelection;
        } else {
          // Add to selection
          return [...prev, lineId];
        }
      });
      setIsModalOpen(true);
    } else {
      // Single select: replace selection
      setSelectedLineIds([lineId]);
      setIsModalOpen(true);
    }
  }, []);

  /**
   * Clear line selection and close modal
   */
  const handleClearSelection = useCallback(() => {
    setSelectedLineIds([]);
    setIsModalOpen(false);
  }, []);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Keep selection but close modal
  }, []);

  /**
   * Handle line property update from modal
   *
   * @param lineId - ID of the line to update
   * @param updates - Partial line properties to update
   */
  const handleLineUpdate = useCallback((lineId: string, updates: Partial<Line>) => {
    setLines(prev => prev.map(line => {
      if (line.id !== lineId) {
        return line;
      }

      try {
        return updateLineProperties(line, updates);
      } catch (error) {
        console.error('Failed to update line properties:', error);
        return line;
      }
    }));
  }, []);

  /**
   * Handle batch update for multi-select
   *
   * @param lineIds - Array of line IDs to update
   * @param updates - Partial line properties to apply to all lines
   */
  const handleBatchUpdate = useCallback((lineIds: string[], updates: Partial<Line>) => {
    setLines(prev => {
      try {
        return batchUpdateLines(prev, lineIds, updates);
      } catch (error) {
        console.error('Failed to batch update lines:', error);
        return prev;
      }
    });
  }, []);

  /**
   * Handle line deletion from modal
   */
  const handleLineDelete = useCallback(() => {
    if (selectedLineIds.length === 0) {
      return;
    }

    setLines(prev => removeLines(prev, selectedLineIds));
    handleClearSelection();
  }, [selectedLineIds, handleClearSelection]);

  /**
   * Handle line duplication from modal
   */
  const handleLineDuplicate = useCallback(() => {
    if (selectedLineIds.length === 0) {
      return;
    }

    const duplicates = selectedLineIds
      .map(lineId => lines.find(line => line.id === lineId))
      .filter((line): line is Line => Boolean(line))
      .map(line => duplicateLine(line, { x: 20, y: 20 }));

    if (duplicates.length === 0) {
      return;
    }

    setLines(prev => [...prev, ...duplicates]);
    setSelectedLineIds(duplicates.map(line => line.id));
  }, [selectedLineIds, lines]);

  /**
   * Handle keyboard shortcuts
   *
   * @param e - Keyboard event
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // D key - toggle draw mode (only if not in an input field and not Cmd/Ctrl+D)
    if (e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey) {
      // Don't toggle if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      setIsDrawActive(v => !v);
      return;
    }

    // Delete key - delete selected lines
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedLineIds.length > 0 && !isModalOpen) {
        e.preventDefault();
        handleLineDelete();
      }
    }

    // Escape key - close modal and clear selection
    if (e.key === 'Escape') {
      if (isModalOpen) {
        e.preventDefault();
        handleModalClose();
      } else if (selectedLineIds.length > 0) {
        e.preventDefault();
        handleClearSelection();
      }
    }

    // Cmd/Ctrl+D - duplicate selected lines
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
      if (selectedLineIds.length > 0) {
        e.preventDefault();
        handleLineDuplicate();
      }
    }
  }, [selectedLineIds, isModalOpen, handleLineDelete, handleModalClose, handleClearSelection, handleLineDuplicate]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle first click in drawing mode - set start point
  const handleDrawingFirstClick = useCallback((rawPos: Pt) => {
    const snap = findSnapTarget(rawPos, lines);
    const startPos = resolveSnapPoint(rawPos, snap);

    handleClearSelection();
    drawingState.startDrawing(startPos, snap);
  }, [lines, drawingState, handleClearSelection]);

  // Handle second click in drawing mode - create line
  const handleDrawingSecondClick = useCallback(() => {
    if (!drawingState.startPoint || !drawingState.endPoint) return;

    const result = createLine({
      startPoint: drawingState.startPoint,
      endPoint: drawingState.endPoint,
      width: defaultWidth,
      color: defaultColor,
    });

    if (!result.success || !result.line) {
      if (result.error) {
        console.warn('Line creation failed:', result.error);
      }
      drawingState.reset();
      return;
    }

    const initializedLine = initializeLineDefaults({
      ...result.line,
      type: defaultColor === '#2563eb' ? 'supply' : 'return',
    });

    setLines(prev => addLine(prev, initializedLine));

    // Only auto-select and open modal if not in draw mode
    // This prevents modal from interrupting multi-line drawing workflow
    if (!isDrawActive) {
      handleLineSelection(initializedLine.id, false);
    }

    drawingState.reset();
  }, [drawingState, defaultWidth, defaultColor, isDrawActive, handleLineSelection]);

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
      // Selection mode - check for endpoint dragging first
      const id = hitTest(rawPos);

      if (id) {
        // Check if clicking near an endpoint
        const endpoint = hitTestEndpoint(rawPos, id);

        if (endpoint) {
          // Start dragging endpoint
          setDraggingEndpoint({ lineId: id, endpoint });
          handleLineSelection(id, false);
          c.style.cursor = 'move';
        } else {
          // Regular selection - check for Shift key for multi-select
          handleLineSelection(id, e.shiftKey);
        }
      } else {
        // Clicked on empty canvas - clear selection
        handleClearSelection();
      }

      render();
    }
  }, [
    isDrawActive,
    drawingState,
    handleDrawingFirstClick,
    handleDrawingSecondClick,
    hitTest,
    hitTestEndpoint,
    render,
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

    const transform = { scale: viewportScale, offset: viewportOffset };
    const cursorPos = screenToCanvas(screenX, screenY, transform);

    // Handle endpoint dragging
    if (draggingEndpoint) {
      const { lineId, endpoint } = draggingEndpoint;

      // Find snap target (excluding the line being edited)
      const snap = findSnapTarget(cursorPos, lines, lineId);
      const newPos = resolveSnapPoint(cursorPos, snap);

      // Update the line's endpoint
      setLines(prev => prev.map(line => {
        if (line.id !== lineId) return line;
        return {
          ...line,
          [endpoint]: newPos
        };
      }));

      return;
    }

    // Only process snapping when in draw mode
    if (!isDrawActive) return;

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
    draggingEndpoint,
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

    // Handle endpoint drag end
    if (draggingEndpoint) {
      setDraggingEndpoint(null);
      c.style.cursor = isDrawActive ? 'crosshair' : 'default';
      return;
    }

    try { c.releasePointerCapture(e.pointerId); } catch {}
    // Note: Line creation now happens in onPointerDown (second click)
    // This handler just cleans up pointer capture
  }, [isPanning, isDrawActive, draggingEndpoint]);

  const updateSelectedWidth = useCallback((fn: (w: number) => number) => {
    if (!selectedId) return;
    setLines(prev => updateLineWidthInCollection(prev, selectedId, fn));
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

  // Length input handlers
  // Get current line length in scaled units
  const getSelectedLineLength = useCallback((): number => {
    if (!selectedId) return 0;
    const line = lines.find(l => l.id === selectedId);
    if (!line) return 0;

    const pixelLength = getLineLength(line);
    const inches = pixelsToInches(pixelLength, currentScale);

    // Convert to appropriate units based on scale type
    if (currentScale.unit === 'metric') {
      // Convert inches to centimeters
      return inches * 2.54;
    } else {
      // Keep as inches for imperial/architectural
      return inches;
    }
  }, [selectedId, lines, currentScale]);

  // Increment length by 1 inch or 1 cm based on scale
  const incrementLength = useCallback(() => {
    if (!selectedId) return;
    const currentLengthScaled = getSelectedLineLength();
    const newLengthScaled = currentLengthScaled + 1;

    // Convert back to pixels
    let newLengthInches: number;
    if (currentScale.unit === 'metric') {
      // Convert cm to inches
      newLengthInches = newLengthScaled / 2.54;
    } else {
      newLengthInches = newLengthScaled;
    }

    const newLengthPixels = newLengthInches * currentScale.pixelsPerInch;
    setLines(prev => updateLineLength(prev, selectedId, newLengthPixels));
  }, [selectedId, getSelectedLineLength, currentScale]);

  // Decrement length by 1 inch or 1 cm based on scale
  const decrementLength = useCallback(() => {
    if (!selectedId) return;
    const currentLengthScaled = getSelectedLineLength();
    const newLengthScaled = Math.max(0.1, currentLengthScaled - 1); // Minimum 0.1 units

    // Convert back to pixels
    let newLengthInches: number;
    if (currentScale.unit === 'metric') {
      // Convert cm to inches
      newLengthInches = newLengthScaled / 2.54;
    } else {
      newLengthInches = newLengthScaled;
    }

    const newLengthPixels = newLengthInches * currentScale.pixelsPerInch;
    setLines(prev => updateLineLength(prev, selectedId, newLengthPixels));
  }, [selectedId, getSelectedLineLength, currentScale]);

  const handleLengthInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string for user to clear and retype
    if (value === '') {
      return;
    }

    // Parse as float (allow decimals)
    const numValue = parseFloat(value);

    // Validate: must be a number and positive
    if (!isNaN(numValue) && numValue > 0) {
      // Convert to pixels
      let lengthInches: number;
      if (currentScale.unit === 'metric') {
        // Convert cm to inches
        lengthInches = numValue / 2.54;
      } else {
        lengthInches = numValue;
      }

      const lengthPixels = lengthInches * currentScale.pixelsPerInch;
      setLines(prev => updateLineLength(prev, selectedId!, lengthPixels));
    }
  }, [selectedId, currentScale]);

  const handleLengthInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);

    // If empty or invalid, reset to current length
    if (value === '' || isNaN(numValue) || numValue <= 0) {
      const currentLength = getSelectedLineLength();
      e.target.value = currentLength.toFixed(1);
    }
  }, [getSelectedLineLength]);

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

  // Sidebar width for FAB positioning
  // When collapsed: 24px toggle button width
  // When expanded: 320px sidebar width
  const sidebarWidth = sidebarCollapsed ? 24 : 320;

  // PDF upload handler
  const handlePdfUpload = useCallback(async (file: File) => {
    try {
      console.log('Loading PDF:', file.name);

      // Load PDF file
      const loadedPdf = await loadPdfFile(file);

      // Render first page
      const imageData = await renderPdfPage(loadedPdf, 1, 2.0);

      // Calculate centered position in canvas coordinates
      // PDF should be positioned at (0, 0) in canvas space and will be centered by default
      const pdfWidth = imageData.width / 2.0; // Divide by render scale
      const pdfHeight = imageData.height / 2.0;

      // Update PDF state
      setPdfState({
        ...loadedPdf,
        imageData,
        offset: { x: 0, y: 0 }, // Position at origin in canvas space
        opacity: pdfOpacity,
        width: pdfWidth,
        height: pdfHeight
      });

      // Trigger re-render
      render();

      console.log('PDF loaded successfully:', file.name);
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [pdfOpacity, render]);

  // PDF opacity change handler
  const handlePdfOpacityChange = useCallback((opacity: number) => {
    setPdfOpacity(opacity);
    if (pdfState) {
      setPdfState(prev => prev ? { ...prev, opacity } : null);
      render();
    }
  }, [pdfState, render]);

  // PDF remove handler
  const handlePdfRemove = useCallback(() => {
    setPdfState(null);
    render();
  }, [render]);

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

  const canZoomIn = viewportScale < MAX_ZOOM;
  const canZoomOut = viewportScale > MIN_ZOOM;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col" style={{
      background: '#E0E5EC'
    }}>
      <CSSTokens />

      {/* Main Content Area - flex row for canvas and sidebar */}
      <div className="flex flex-1 overflow-hidden">
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
          sidebarWidth={0}
        >
          {/* Line Properties Modal - replaces old Width HUD */}
          {isModalOpen && selectedLineIds.length > 0 && (
            <LinePropertiesModal
              selectedLines={selectedLineIds.map(id => lines.find(l => l.id === id)!).filter(Boolean)}
              onUpdate={handleLineUpdate}
              onBatchUpdate={handleBatchUpdate}
              onClose={handleModalClose}
              onDuplicate={handleLineDuplicate}
              onDelete={handleLineDelete}
              onDeleteAll={handleLineDelete}
              viewportBounds={{
                width: containerRef.current?.clientWidth || window.innerWidth,
                height: containerRef.current?.clientHeight || window.innerHeight,
                scrollX: 0,
                scrollY: 0,
              }}
              canvasBounds={containerRef.current?.getBoundingClientRect()}
              isOpen={isModalOpen}
            />
          )}

          {/* Draw Mode Toggle Button */}
          <DrawButton
            isActive={isDrawActive}
            onToggle={() => setIsDrawActive(v => !v)}
            sidebarWidth={sidebarWidth}
          />
        </CanvasRenderer>

        {/* Sidebar - Part of flex layout, not fixed */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(v => !v)}
          lineSummary={lineSummary}
          currentScale={currentScale}
          width={320}
        />
      </div>

      {/* Bottom Bar - Zoom Controls, Scale Selector, and PDF Controls */}
      <BottomBar
        zoom={viewportScale}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentScale={currentScale}
        scaleOptions={allScaleOptions}
        onScaleChange={setCurrentScale}
        onPdfUpload={handlePdfUpload}
        hasPdf={pdfState !== null}
        pdfOpacity={pdfOpacity}
        onPdfOpacityChange={handlePdfOpacityChange}
        onPdfRemove={handlePdfRemove}
      />
    </div>
  );
}
