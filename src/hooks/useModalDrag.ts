/**
 * useModalDrag Hook
 * 
 * Custom hook for making modals draggable by their header.
 * Preserves initial smart positioning while allowing user repositioning.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Modal position
 */
export interface ModalPosition {
  x: number;
  y: number;
}

/**
 * Drag handler props to apply to drag handle element
 */
export interface DragHandleProps {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  style: {
    cursor: string;
    userSelect: 'none' | 'auto';
  };
}

/**
 * Props for useModalDrag hook
 */
export interface UseModalDragProps {
  /** Initial position calculated by useModalPosition */
  initialPosition: ModalPosition;
  /** Whether modal is currently open */
  isOpen: boolean;
  /** Viewport bounds for constraining drag */
  viewportBounds?: {
    width: number;
    height: number;
  };
  /** Modal dimensions for boundary calculations */
  modalDimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Return value from useModalDrag hook
 */
export interface UseModalDragReturn {
  /** Final position (initial + drag offset) */
  position: ModalPosition;
  /** Whether currently dragging */
  isDragging: boolean;
  /** Props to spread on drag handle element */
  dragHandleProps: DragHandleProps;
}

/**
 * useModalDrag Hook
 * 
 * Makes a modal draggable while preserving initial smart positioning.
 * 
 * Features:
 * - Drag modal by clicking and dragging the header
 * - Initial position from useModalPosition is preserved
 * - Drag offset is tracked and applied to initial position
 * - Resets drag offset when modal reopens
 * - Prevents dragging modal completely off-screen
 * - Visual feedback with cursor changes (grab/grabbing)
 * - Prevents text selection during drag
 * 
 * @param props - Hook props
 * @returns Position, dragging state, and drag handler props
 * 
 * @example
 * ```tsx
 * const { position, isDragging, dragHandleProps } = useModalDrag({
 *   initialPosition: { x: 100, y: 100 },
 *   isOpen: true,
 *   viewportBounds: { width: 1920, height: 1080 },
 *   modalDimensions: { width: 220, height: 320 },
 * });
 * 
 * // Apply to modal
 * <div style={{ left: position.x, top: position.y }}>
 *   <header {...dragHandleProps}>Drag me</header>
 * </div>
 * ```
 */
export function useModalDrag(props: UseModalDragProps): UseModalDragReturn {
  const { initialPosition, isOpen, viewportBounds, modalDimensions } = props;

  // Track drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<ModalPosition>({ x: 0, y: 0 });

  // Track drag start positions (using ref to avoid stale closures)
  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    modalX: number;
    modalY: number;
  } | null>(null);

  /**
   * Reset drag offset when modal reopens
   */
  useEffect(() => {
    if (isOpen) {
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isOpen]);

  /**
   * Constrain position to viewport bounds
   */
  const constrainPosition = useCallback(
    (x: number, y: number): ModalPosition => {
      if (!viewportBounds || !modalDimensions) {
        return { x, y };
      }

      const minVisibleWidth = 100; // Keep at least 100px of header visible
      const minVisibleHeight = 50; // Keep at least 50px of header visible

      // Constrain X
      const minX = -modalDimensions.width + minVisibleWidth;
      const maxX = viewportBounds.width - minVisibleWidth;
      const constrainedX = Math.max(minX, Math.min(maxX, x));

      // Constrain Y (don't allow dragging above viewport)
      const minY = 0;
      const maxY = viewportBounds.height - minVisibleHeight;
      const constrainedY = Math.max(minY, Math.min(maxY, y));

      return { x: constrainedX, y: constrainedY };
    },
    [viewportBounds, modalDimensions]
  );

  /**
   * Handle mouse down on drag handle
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Only handle left mouse button
      if (e.button !== 0) return;

      // Prevent text selection
      e.preventDefault();

      // Record starting positions
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        modalX: initialPosition.x + dragOffset.x,
        modalY: initialPosition.y + dragOffset.y,
      };

      setIsDragging(true);
    },
    [initialPosition, dragOffset]
  );

  /**
   * Handle mouse move during drag
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      // Calculate how far mouse has moved
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      // Calculate new modal position
      const newX = dragStartRef.current.modalX + deltaX;
      const newY = dragStartRef.current.modalY + deltaY;

      // Constrain to viewport
      const constrained = constrainPosition(newX, newY);

      // Update drag offset (relative to initial position)
      setDragOffset({
        x: constrained.x - initialPosition.x,
        y: constrained.y - initialPosition.y,
      });
    },
    [isDragging, initialPosition, constrainPosition]
  );

  /**
   * Handle mouse up to end drag
   */
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
    }
  }, [isDragging]);

  /**
   * Add/remove global mouse event listeners
   */
  useEffect(() => {
    if (isDragging) {
      // Add listeners to window for smooth dragging
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // Prevent text selection during drag
      document.body.style.userSelect = 'none';

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  /**
   * Calculate final position
   */
  const finalPosition: ModalPosition = {
    x: initialPosition.x + dragOffset.x,
    y: initialPosition.y + dragOffset.y,
  };

  /**
   * Drag handle props
   */
  const dragHandleProps: DragHandleProps = {
    onMouseDown: handleMouseDown,
    style: {
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
    },
  };

  return {
    position: finalPosition,
    isDragging,
    dragHandleProps,
  };
}

