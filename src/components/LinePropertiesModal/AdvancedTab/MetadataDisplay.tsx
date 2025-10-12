/**
 * MetadataDisplay Component
 * 
 * Displays read-only metadata information for a line.
 * Shows line ID and creation/update timestamps.
 */

import React from 'react';

/**
 * Props for MetadataDisplay component
 */
export interface MetadataDisplayProps {
  /** Line ID */
  lineId: string;
  /** Creation timestamp (Unix timestamp in milliseconds) */
  createdAt: number;
  /** Last update timestamp (Unix timestamp in milliseconds) */
  updatedAt: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * MetadataDisplay Component
 * 
 * Displays line metadata in a read-only format.
 * 
 * Features:
 * - Light gray background (#f3f4f6)
 * - 8px padding, 4px border radius
 * - Line ID in monospace font
 * - Formatted timestamps (e.g., "Oct 12, 9:45 PM")
 * - 11px text size
 * - Read-only display
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <MetadataDisplay
 *   lineId="a3f82b1c-4d5e-6f7g-8h9i-0j1k2l3m4n5o"
 *   createdAt={1697123456789}
 *   updatedAt={1697234567890}
 * />
 * // Displays:
 * // ID: a3f82b1c
 * // Created: Oct 12, 9:45 PM
 * // Updated: Oct 13, 2:36 PM
 * ```
 */
export function MetadataDisplay(props: MetadataDisplayProps): JSX.Element {
  const { lineId, createdAt, updatedAt, className = '' } = props;

  /**
   * Format timestamp to readable string
   */
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  /**
   * Get short ID (first 8 characters)
   */
  const shortId = lineId.substring(0, 8);

  return (
    <div
      className={`bg-neutral-100 rounded p-2 ${className}`}
      role="region"
      aria-label="Line metadata"
    >
      <div className="space-y-1 text-xs text-neutral-600">
        {/* Line ID */}
        <div className="flex items-center gap-2">
          <span className="font-medium">ID:</span>
          <span className="font-mono text-neutral-700">{shortId}</span>
        </div>

        {/* Created timestamp */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Created:</span>
          <span>{formatTimestamp(createdAt)}</span>
        </div>

        {/* Updated timestamp */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Updated:</span>
          <span>{formatTimestamp(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

