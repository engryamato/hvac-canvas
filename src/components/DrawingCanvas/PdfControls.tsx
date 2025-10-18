/**
 * PDF Controls Component
 *
 * Controls for managing PDF overlay (opacity, remove)
 */

import React from 'react';
import { X } from 'lucide-react';

export interface PdfControlsProps {
  /** PDF filename */
  filename: string;
  /** Current opacity (0-1) */
  opacity: number;
  /** Callback when opacity changes */
  onOpacityChange: (opacity: number) => void;
  /** Callback when remove button clicked */
  onRemove: () => void;
}

/**
 * PDF Controls Component
 *
 * Displays PDF filename, opacity slider, and remove button
 */
export function PdfControls(props: PdfControlsProps): JSX.Element {
  const { filename, opacity, onOpacityChange, onRemove } = props;

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOpacityChange(parseFloat(e.target.value));
  };

  return (
    <div className="absolute top-4 left-4 glass-pdf-controls rounded-lg border p-3 z-20 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium text-neutral-700">PDF Overlay</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className={[
            "w-6 h-6 flex items-center justify-center rounded",
            "glass-tier3 glass-tier3-hover transition-all",
            "focus:outline-none focus-visible:ring-2"
          ].join(" ")}
          title="Remove PDF"
          aria-label="Remove PDF"
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {/* Filename */}
      <div className="mb-3">
        <p className="text-xs text-neutral-500 truncate" title={filename}>
          {filename}
        </p>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="pdf-opacity" className="text-xs text-neutral-600">
            Opacity
          </label>
          <span className="text-xs text-neutral-900 font-medium tabular-nums">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          id="pdf-opacity"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={handleOpacityChange}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          aria-label="PDF opacity"
        />
      </div>
    </div>
  );
}
