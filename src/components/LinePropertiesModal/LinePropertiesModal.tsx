/**
 * LinePropertiesModal Component
 * 
 * Main modal component for editing line properties.
 * Supports single-select and multi-select modes with three tabs.
 */

import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import type { Line, ConnectionGraph, LineEndpoint, LineConnection } from '../../types/drawing.types';
import { ModalHeader } from './ModalHeader';
import { TabBar, type ModalTab } from './TabBar';
import { ModalFooter } from './ModalFooter';
import { Separator } from './shared';
import { PropertiesTab } from './PropertiesTab';
import { CalculationsTab } from './CalculationsTab';
import { AdvancedTab } from './AdvancedTab';
import { ConnectionsTab } from './ConnectionsTab';
import {
  MultiSelectHeader,
  MultiSelectWarning,
  MultiSelectFooter,
} from './MultiSelect';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { useModalDrag } from '../../hooks/useModalDrag';
import type { ViewportBounds } from '../../hooks/useModalPosition';
import { MODAL_WIDTH, MODAL_WIDTH_MIN } from '../../constants/modal.constants';

/**
 * Props for LinePropertiesModal component
 */
export interface LinePropertiesModalProps {
  /** Selected lines (single or multiple) */
  selectedLines: Line[];
  /** Update handler for line properties */
  onUpdate: (lineId: string, updates: Partial<Line>) => void;
  /** Batch update handler for multi-select */
  onBatchUpdate?: (lineIds: string[], updates: Partial<Line>) => void;
  /** Close handler */
  onClose: () => void;
  /** Duplicate handler (single-select only) */
  onDuplicate: () => void;
  /** Delete handler */
  onDelete: () => void;
  /** Delete all handler (multi-select only) */
  onDeleteAll?: () => void;
  /** Viewport bounds for positioning */
  viewportBounds: ViewportBounds;
  /** Canvas bounds for positioning */
  canvasBounds?: DOMRect;
  /** Whether modal is open */
  isOpen: boolean;
  /** Connection graph for all lines (Phase 4 integration) */
  connections?: ConnectionGraph;
  /** Get connected endpoints callback (Phase 4 integration) */
  getConnectedEndpoints?: (lineId: string, endpoint: LineEndpoint) => LineConnection[];
}

/**
 * LinePropertiesModal Component
 * 
 * The main modal for editing line properties.
 * 
 * Features:
 * - **Single-Select Mode**: Edit one line with full property access
 * - **Multi-Select Mode**: Edit multiple lines with mixed value detection
 * - **Four Tabs**: Properties, Calculations, Advanced, Connections
 * - **Centered Layout**: Stays centered on screen with smooth transitions
 * - **Adaptive Height**: Grows with content up to the viewport limit
 * - **Responsive Width**: 280px on normal viewports, 240px on small viewports (< 400px)
 * - **Animations**: Smooth open/close with fade and scale
 * - **Keyboard Navigation**: Full keyboard support with focus trap
 * - **Accessibility**: ARIA labels, roles, and screen reader support
 *
 * Dimensions:
 * - Width: 280px (responsive: 240px on small viewports)
 * - Padding: 16px all sides
 * - Height: Adapts to content (capped to viewport for scrollable body)
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <LinePropertiesModal
 *   selectedLines={[line1, line2]}
 *   onUpdate={(id, updates) => updateLine(id, updates)}
 *   onClose={() => setIsOpen(false)}
 *   onDuplicate={() => duplicateLine()}
 *   onDelete={() => deleteLine()}
 *   viewportBounds={{ width: 1920, height: 1080, scrollX: 0, scrollY: 0 }}
 *   isOpen={true}
 * />
 * ```
 */
export function LinePropertiesModal(props: LinePropertiesModalProps): JSX.Element | null {
  const {
    selectedLines,
    onUpdate,
    onBatchUpdate,
    onClose,
    onDuplicate,
    onDelete,
    onDeleteAll,
    viewportBounds,
    isOpen,
    connections,
    getConnectedEndpoints,
  } = props;

  // Modal ref for keyboard navigation
  const modalRef = useRef<HTMLDivElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<ModalTab>('properties');

  // Properties tab expanded state
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(false);

  // Determine if multi-select mode
  const isMultiSelect = selectedLines.length > 1;

  // Get first line for positioning
  const firstLine = selectedLines[0];

  const animation = useModalAnimation({ isOpen });

  useModalKeyboard({
    isOpen: isOpen && animation.shouldRender,
    onClose,
    modalRef,
  });

  // Calculate responsive width based on viewport
  // Use MODAL_WIDTH_MIN for small viewports (< 400px), otherwise use MODAL_WIDTH
  const responsiveWidth = useMemo(() => {
    return viewportBounds.width < 400 ? MODAL_WIDTH_MIN : MODAL_WIDTH;
  }, [viewportBounds.width]);

  // Track modal size for centering and drag constraints
  const [modalSize, setModalSize] = useState<{ width: number; height: number }>({
    width: responsiveWidth,
    height: 360,
  });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const node = modalRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setModalSize({
      width: rect.width,
      height: rect.height,
    });
  }, [
    isOpen,
    animation.isVisible,
    activeTab,
    isPropertiesExpanded,
    selectedLines.length,
    responsiveWidth,
  ]);

  const initialPosition = useMemo(() => {
    const width = modalSize.width || responsiveWidth;
    const height = modalSize.height || 360;
    const viewportWidth = viewportBounds.width;
    const viewportHeight = viewportBounds.height;

    const centeredX = Math.max((viewportWidth - width) / 2, 0);
    const centeredY = Math.max((viewportHeight - height) / 2, 0);

    return {
      x: centeredX,
      y: centeredY,
    };
  }, [modalSize.width, modalSize.height, responsiveWidth, viewportBounds.width, viewportBounds.height]);

  const { position, isDragging, dragHandleProps } = useModalDrag({
    initialPosition,
    isOpen,
    viewportBounds: {
      width: viewportBounds.width,
      height: viewportBounds.height,
    },
    modalDimensions: {
      width: modalSize.width,
      height: modalSize.height,
    },
  });

  // Handle line update
  const handleUpdate = (updates: Partial<Line>) => {
    if (isMultiSelect && onBatchUpdate) {
      const lineIds = selectedLines.map((line) => line.id);
      onBatchUpdate(lineIds, updates);
    } else if (firstLine) {
      onUpdate(firstLine.id, updates);
    }
  };

  // Don't render if animation says not to
  if (!animation.shouldRender) {
    return null;
  }

  // Generate unique IDs for ARIA relationships
  const modalTitleId = 'modal-title';
  const modalDescId = 'modal-description';

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop - pointer-events-none allows clicks to pass through */}
      <div
        className={[
          'fixed inset-0',
          animation.animationClass,
        ].join(' ')}
        style={{
          zIndex: 999,
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Modal Container - pointer-events-auto allows modal to receive events */}
      <div
        className="fixed inset-0 z-[1000]"
        style={{ pointerEvents: 'auto' }}
        onClick={handleBackdropClick}
      >
        {/* Modal Dialog */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={isMultiSelect ? modalDescId : undefined}
          className={[
            'neumorphic-raised-xl p-8',
            'flex flex-col',
            animation.animationClass,
          ].join(' ')}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${responsiveWidth}px`,
            maxWidth: '90vw',
            maxHeight: '85vh',
            borderRadius: '8px',
            overflow: 'hidden',
            transition: isDragging
              ? 'none'
              : 'left 200ms ease, top 200ms ease, width 200ms ease, transform 200ms ease, opacity 200ms ease',
            pointerEvents: 'auto',
          }}
        >
          {/* Header */}
          {isMultiSelect ? (
            <>
              <MultiSelectHeader
                selectedCount={selectedLines.length}
                dragHandleProps={dragHandleProps}
              />
              {/* Hidden description for screen readers */}
              <span id={modalDescId} className="sr-only">
                Editing {selectedLines.length} lines simultaneously. Changes will apply to all selected lines.
              </span>
            </>
          ) : (
            <ModalHeader
              titleId={modalTitleId}
              dragHandleProps={dragHandleProps}
            />
          )}

          <Separator className="my-3" aria-hidden="true" />

          {/* Multi-Select Warning */}
          {isMultiSelect && <MultiSelectWarning className="mb-2" />}

          {/* Tab Bar */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

          <Separator className="my-3" aria-hidden="true" />

          {/* Tab Content */}
          <div
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
            tabIndex={0}
            className="flex-1 min-h-0 overflow-y-auto focus:outline-none pr-1 pb-2"
          >
            {activeTab === 'properties' && firstLine && (
              <PropertiesTab
                line={firstLine}
                onUpdate={handleUpdate}
                expanded={isPropertiesExpanded}
                onToggleExpand={() => setIsPropertiesExpanded(!isPropertiesExpanded)}
                className="animate-in fade-in duration-150"
              />
            )}

            {activeTab === 'calculations' && firstLine && (
              <CalculationsTab
                line={firstLine}
                onUpdate={handleUpdate}
                className="animate-in fade-in duration-150"
              />
            )}

            {activeTab === 'advanced' && firstLine && (
              <AdvancedTab
                line={firstLine}
                onUpdate={handleUpdate}
                className="animate-in fade-in duration-150"
              />
            )}

            {activeTab === 'connections' && firstLine && (
              <ConnectionsTab
                line={firstLine}
                connections={connections}
                getConnectedEndpoints={getConnectedEndpoints}
                className="animate-in fade-in duration-150"
              />
            )}
          </div>

          <Separator className="my-4" aria-hidden="true" />

          {/* Footer */}
          {isMultiSelect ? (
            <MultiSelectFooter
              onApply={onClose}
              onDeleteAll={onDeleteAll || onDelete}
            />
          ) : (
            <ModalFooter onDuplicate={onDuplicate} onDelete={onDelete} />
          )}
        </div>
      </div>
    </>
  );
}
