/**
 * Sidebar Component
 * 
 * Collapsible sidebar displaying line summary and scale information.
 * Shows lines grouped by width with count and total length.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LineSummaryRow, Scale } from '../../types';

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
  /** Whether the sidebar is collapsed */
  collapsed: boolean;
  /** Callback when toggle button is clicked */
  onToggle: () => void;
  /** Line summary data grouped by width */
  lineSummary: LineSummaryRow[];
  /** Current scale being used */
  currentScale: Scale;
  /** Width of the sidebar when expanded (in pixels) */
  width?: number;
}

/**
 * Sidebar Component
 * 
 * Displays a collapsible sidebar with:
 * - Line summary table (grouped by width)
 * - Scale information
 * - Toggle button for collapse/expand
 * 
 * Features:
 * - Smooth collapse/expand animation
 * - Responsive table layout
 * - Empty state message
 * - Accessible toggle button
 * 
 * @param props - Component props
 * 
 * @example
 * <Sidebar
 *   collapsed={sidebarCollapsed}
 *   onToggle={() => setSidebarCollapsed(v => !v)}
 *   lineSummary={lineSummaryRows}
 *   currentScale={currentScale}
 *   width={320}
 * />
 */
export function Sidebar(props: SidebarProps): JSX.Element {
  const { collapsed, onToggle, lineSummary, currentScale, width = 320 } = props;

  const sidebarWidth = collapsed ? 0 : width;

  return (
    <>
      {/* Sidebar Toggle Button - Fixed to not overlap bottom bar */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed top-0 w-6 bg-neutral-200 hover:bg-neutral-300 transition-colors flex items-center justify-center z-10"
        style={{
          right: `${sidebarWidth}px`,
          height: 'calc(100vh - 60px)' // Stop before bottom bar (60px)
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronLeft className="w-4 h-4 text-neutral-700" />
        ) : (
          <ChevronRight className="w-4 h-4 text-neutral-700" />
        )}
      </button>

      {/* Sidebar Content - Fixed to not overlap bottom bar */}
      {!collapsed && (
        <div
          className="fixed top-0 right-0 bg-white border-l border-neutral-200 flex flex-col"
          style={{
            width: `${width}px`,
            height: 'calc(100vh - 60px)' // Stop before bottom bar (60px)
          }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-lg font-semibold text-neutral-800">Line Summary</h2>
            <p className="text-xs text-neutral-500 mt-1">Scale: {currentScale.displayName}</p>
          </div>

          {/* Line Summary Table */}
          <div className="flex-1 overflow-y-auto p-4">
            {lineSummary.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center mt-8">
                No lines drawn yet
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-2 px-2 text-left text-neutral-600 font-medium">Width</th>
                    <th className="py-2 px-2 text-right text-neutral-600 font-medium">Count</th>
                    <th className="py-2 px-2 text-right text-neutral-600 font-medium">Total Length</th>
                  </tr>
                </thead>
                <tbody>
                  {lineSummary.map((row) => (
                    <tr key={row.width} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-2 px-2 text-neutral-800 font-medium">{row.widthDisplay}</td>
                      <td className="py-2 px-2 text-right text-neutral-600 text-mono tabular-nums">{row.count}</td>
                      <td className="py-2 px-2 text-right text-neutral-800 text-mono tabular-nums">{row.totalLengthDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}

