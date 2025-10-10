/**
 * BottomBar Component
 *
 * Bottom bar with zoom controls and scale selector.
 * Fixed at the bottom of the screen with shadow overlay.
 */

import React, { useRef } from 'react';
import { ZoomIn, ZoomOut, Upload } from 'lucide-react';
import type { Scale } from '../../types';

/**
 * Props for BottomBar component
 */
export interface BottomBarProps {
  /** Current zoom level (scale) */
  zoom: number;
  /** Whether can zoom in further */
  canZoomIn: boolean;
  /** Whether can zoom out further */
  canZoomOut: boolean;
  /** Callback when zoom in button is clicked */
  onZoomIn: () => void;
  /** Callback when zoom out button is clicked */
  onZoomOut: () => void;
  /** Current drawing scale */
  currentScale: Scale;
  /** Available scale options */
  scaleOptions: Scale[];
  /** Callback when scale is changed */
  onScaleChange: (scale: Scale) => void;
  /** Callback when PDF file is selected */
  onPdfUpload?: (file: File) => void;
  /** Whether PDF is currently loaded */
  hasPdf?: boolean;
  /** Current PDF opacity (0-1) */
  pdfOpacity?: number;
  /** Callback when PDF opacity changes */
  onPdfOpacityChange?: (opacity: number) => void;
  /** Callback when PDF remove is clicked */
  onPdfRemove?: () => void;
}

/**
 * BottomBar Component
 *
 * Displays zoom controls, scale selector, and pan instructions at the bottom of the screen.
 *
 * Features:
 * - Lens icon with +/- zoom controls
 * - Current zoom percentage display
 * - Scale dropdown selector
 * - Pan instruction text
 * - Fixed positioning with shadow
 *
 * @param props - Component props
 *
 * @example
 * <BottomBar
 *   zoom={1.5}
 *   canZoomIn={true}
 *   canZoomOut={true}
 *   onZoomIn={() => viewport.zoomIn({ x: 400, y: 300 })}
 *   onZoomOut={() => viewport.zoomOut({ x: 400, y: 300 })}
 *   currentScale={currentScale}
 *   scaleOptions={allScales}
 *   onScaleChange={(scale) => setCurrentScale(scale)}
 * />
 */
export function BottomBar(props: BottomBarProps): JSX.Element {
  const {
    zoom,
    canZoomIn,
    canZoomOut,
    onZoomIn,
    onZoomOut,
    currentScale,
    scaleOptions,
    onScaleChange,
    onPdfUpload,
    hasPdf = false,
    pdfOpacity = 0.5,
    onPdfOpacityChange,
    onPdfRemove
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const zoomPercentage = Math.round(zoom * 100);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onPdfUpload?.(file);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-between px-4 gap-4">
      {/* Left Side - PDF Controls */}
      <div className="flex items-center gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload PDF file"
        />

        {/* Upload PDF Button */}
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors text-sm text-neutral-700"
          title="Upload PDF"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF</span>
        </button>

        {/* PDF Opacity Control - Only show when PDF is loaded */}
        {hasPdf && onPdfOpacityChange && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-300 bg-neutral-50">
            <span className="text-xs text-neutral-600 whitespace-nowrap">PDF Opacity:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={pdfOpacity}
              onChange={(e) => onPdfOpacityChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary-500)]"
              aria-label="PDF opacity"
              title={`PDF Opacity: ${Math.round(pdfOpacity * 100)}%`}
            />
            <span className="text-xs text-neutral-700 font-medium min-w-[32px] text-right tabular-nums">
              {Math.round(pdfOpacity * 100)}%
            </span>
          </div>
        )}

        {/* Remove PDF Button - Only show when PDF is loaded */}
        {hasPdf && onPdfRemove && (
          <button
            type="button"
            onClick={onPdfRemove}
            className="px-2 py-1.5 rounded border border-red-300 bg-white hover:bg-red-50 transition-colors text-sm text-red-600"
            title="Remove PDF"
          >
            <Upload className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      {/* Center - Zoom Controls and Scale Selector */}
      <div className="flex items-center gap-4">
        {/* Zoom Controls Group */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-300 bg-neutral-50">
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={onZoomOut}
            disabled={!canZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom out"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4 text-neutral-700" />
          </button>

          {/* Zoom Percentage Display */}
          <span className="text-sm text-neutral-900 tabular-nums font-medium min-w-[50px] text-center">
            {zoomPercentage}%
          </span>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={onZoomIn}
            disabled={!canZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom in"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        {/* Scale Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="scale-selector" className="text-sm text-neutral-600">
            Scale:
          </label>
          <select
            id="scale-selector"
            value={currentScale.displayName}
            onChange={(e) => {
              const selectedScale = scaleOptions.find(s => s.displayName === e.target.value);
              if (selectedScale) {
                onScaleChange(selectedScale);
              }
            }}
            className="px-3 py-1.5 text-sm rounded border border-neutral-300 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-colors cursor-pointer"
            aria-label="Select drawing scale"
          >
            {scaleOptions.map((scale) => (
              <option key={scale.displayName} value={scale.displayName}>
                {scale.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Side - Pan Instruction */}
      <div className="flex items-center">
        <span className="text-xs text-neutral-500">
          Right-click + drag to pan
        </span>
      </div>
    </div>
  );
}

