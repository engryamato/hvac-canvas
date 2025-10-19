/**
 * LinePropertiesModal Component
 * 
 * Main modal component for editing line properties.
 * Supports single-select and multi-select modes with three tabs.
 */

import React, { useState, useRef, useMemo } from 'react';
import type { Line } from '../../types/drawing.types';
import { ModalHeader } from './ModalHeader';
import { TabBar, type ModalTab } from './TabBar';
import { ModalFooter } from './ModalFooter';
import { Separator } from './shared';
import { PropertiesTab } from './PropertiesTab';
import { CalculationsTab } from './CalculationsTab';
import { AdvancedTab } from './AdvancedTab';
import {
  MultiSelectHeader,
  MultiSelectWarning,
  MultiSelectFooter,
} from './MultiSelect';
import { useModalPosition, type ViewportBounds } from '../../hooks/useModalPosition';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { useModalDrag } from '../../hooks/useModalDrag';
import {
  MODAL_WIDTH,
  PROPERTIES_TAB_HEIGHT_COLLAPSED,
  PROPERTIES_TAB_HEIGHT_EXPANDED,
  CALCULATIONS_TAB_HEIGHT,
  ADVANCED_TAB_HEIGHT,
} from '../../constants/modal.constants';

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
}

/**
 * LinePropertiesModal Component
 * 
 * The main modal for editing line properties.
 * 
 * Features:
 * - **Single-Select Mode**: Edit one line with full property access
 * - **Multi-Select Mode**: Edit multiple lines with mixed value detection
 * - **Three Tabs**: Properties, Calculations, Advanced
 * - **Smart Positioning**: Positions near selected line(s)
 * - **Animations**: Smooth open/close with fade and scale
 * - **Keyboard Navigation**: Full keyboard support with focus trap
 * - **Accessibility**: ARIA labels, roles, and screen reader support
 * 
 * Dimensions:
 * - Width: 220px
 * - Padding: 16px all sides
 * - Height: Dynamic based on active tab and expanded state
 *   - Properties (collapsed): 280px
 *   - Properties (expanded): 480px
 *   - Calculations: 320px
 *   - Advanced: 360px
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
    canvasBounds,
    isOpen,
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

  // Calculate modal height based on active tab and expanded state
  const modalHeight = useMemo(() => {
    if (activeTab === 'properties') {
      return isPropertiesExpanded
        ? PROPERTIES_TAB_HEIGHT_EXPANDED
        : PROPERTIES_TAB_HEIGHT_COLLAPSED;
    } else if (activeTab === 'calculations') {
      return CALCULATIONS_TAB_HEIGHT;
    } else {
      return ADVANCED_TAB_HEIGHT;
    }
  }, [activeTab, isPropertiesExpanded]);

  // Use custom hooks
  const initialPosition = useModalPosition({
    selectedLineId: firstLine?.id || null,
    lines: selectedLines,
    modalHeight,
    viewportBounds,
    canvasBounds,
  });

  const animation = useModalAnimation({ isOpen });

  const { position, isDragging, dragHandleProps } = useModalDrag({
    initialPosition,
    isOpen,
    viewportBounds,
    modalDimensions: {
      width: MODAL_WIDTH,
      height: modalHeight,
    },
  });

  useModalKeyboard({
    isOpen: isOpen && animation.shouldRender,
    onClose,
    modalRef,
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
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0',
          animation.animationClass,
        ].join(' ')}
        style={{
          zIndex: 999,
          background: 'rgba(224, 229, 236, 0.3)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        aria-describedby={isMultiSelect ? modalDescId : undefined}
        className={[
          'fixed neumorphic-raised-xl p-8',
          animation.animationClass,
        ].join(' ')}
        style={{
          width: `${MODAL_WIDTH}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          borderRadius: '32px',
          // Disable transition during drag for immediate feedback
          transition: isDragging ? 'none' : 'left 200ms ease-in-out, top 200ms ease-in-out',
          zIndex: 1000,
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
        style={{ height: `${modalHeight}px` }}
        className="overflow-y-auto focus:outline-none"
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
    </>
  );
}

