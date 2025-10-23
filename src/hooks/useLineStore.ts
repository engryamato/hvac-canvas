/**
 * useLineStore Hook
 *
 * Manages the line collection, selection state, and modal visibility for the drawing canvas.
 * Provides immutable operations for adding, updating, deleting, and duplicating lines while
 * coordinating selection logic in one place.
 */

import { useCallback, useMemo, useState } from 'react';
import type { Line, ConnectionGraph, LineEndpoint, LineConnection } from '../types';
import {
  addLine as addLineToCollection,
  updateLineLength as updateLineLengthInCollection,
  updateLineColorInCollection,
  updateLineWidthInCollection,
  batchUpdateLines as batchUpdateLinesService,
  updateLineProperties as updateLinePropertiesService,
  removeLines as removeLinesFromCollection,
  duplicateLine,
  buildConnectionGraph,
  getConnectedEndpoints as getConnectedEndpointsService,
} from '../services';
import { CONNECTION_TOLERANCE_PX } from '../constants';

/**
 * Options for adding a line to the store.
 */
export interface AddLineOptions {
  /** Whether the new line should become the active selection */
  select?: boolean;
  /** Whether the selection modal should open after adding */
  openModal?: boolean;
}

/**
 * Options for selecting a line.
 */
export interface SelectLineOptions {
  /** Whether to append to the existing selection */
  multiSelect?: boolean;
  /** Whether to open the modal after selection */
  openModal?: boolean;
}

/**
 * Return type for useLineStore.
 */
export interface UseLineStoreReturn {
  /** Current collection of lines */
  lines: Line[];
  /** Lines currently selected */
  selectedLines: Line[];
  /** Selected line IDs */
  selectedLineIds: string[];
  /** Whether the line properties modal is open */
  isModalOpen: boolean;
  /** Whether any lines are selected */
  hasSelection: boolean;
  /** Connection graph for all lines */
  connections: ConnectionGraph;
  /** Get connected endpoints for a specific line endpoint */
  getConnectedEndpoints: (lineId: string, endpoint: LineEndpoint) => LineConnection[];
  /** Add a new line to the collection */
  addLine: (line: Line, options?: AddLineOptions) => void;
  /** Replace the entire line collection */
  replaceLines: (next: Line[]) => void;
  /** Mutate the collection with an updater function */
  updateLines: (updater: (prev: Line[]) => Line[]) => void;
  /** Update a specific line via callback */
  updateLine: (lineId: string, updater: (line: Line) => Line) => void;
  /** Update a line using the LineProperties service (with validation) */
  updateLineProperties: (lineId: string, updates: Partial<Line>) => void;
  /** Apply batch updates to multiple lines */
  batchUpdateLines: (lineIds: string[], updates: Partial<Line>) => void;
  /** Remove specific lines by ID */
  removeLinesById: (lineIds: string[]) => void;
  /** Remove currently selected lines */
  removeSelectedLines: () => void;
  /** Duplicate currently selected lines */
  duplicateSelectedLines: (offset?: { x: number; y: number }) => void;
  /** Update selected line width via updater */
  updateSelectedLineWidth: (lineId: string, updater: (width: number) => number) => void;
  /** Select a line (supports multi-select) */
  selectLine: (lineId: string, options?: SelectLineOptions) => void;
  /** Set the selection directly */
  setSelection: (lineIds: string[], options?: { openModal?: boolean }) => void;
  /** Clear the current selection */
  clearSelection: () => void;
  /** Open the line properties modal */
  openModal: () => void;
  /** Close the line properties modal */
  closeModal: () => void;
  /** Force modal visibility */
  setModalOpen: (isOpen: boolean) => void;
  /** Update a line's length (keeps endpoint A fixed) */
  updateLineLength: (lineId: string, newLengthPixels: number) => void;
  /** Update a line's color */
  updateLineColor: (lineId: string, color: string) => void;
}

/**
 * Custom hook that centralizes line collection and selection logic.
 *
 * @param initialLines - Optional initial line collection
 * @returns Line store state and operations
 */
export function useLineStore(initialLines: Line[] = []): UseLineStoreReturn {
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasSelection = selectedLineIds.length > 0;

  const selectedLines = useMemo(() => {
    const selection = new Set(selectedLineIds);
    return lines.filter((line) => selection.has(line.id));
  }, [lines, selectedLineIds]);

  // Compute connection graph whenever lines change
  const connections = useMemo(() => {
    return buildConnectionGraph(lines, CONNECTION_TOLERANCE_PX);
  }, [lines]);

  // Helper to get connections for a specific endpoint
  const getConnectedEndpoints = useCallback(
    (lineId: string, endpoint: LineEndpoint) => {
      return getConnectedEndpointsService(connections, lineId, endpoint);
    },
    [connections]
  );

  const replaceLines = useCallback((next: Line[]) => {
    setLines(next);
  }, []);

  const updateLines = useCallback((updater: (prev: Line[]) => Line[]) => {
    setLines((prev) => updater(prev));
  }, []);

  const updateLine = useCallback((lineId: string, updater: (line: Line) => Line) => {
    setLines((prev) =>
      prev.map((line) => (line.id === lineId ? updater(line) : line))
    );
  }, []);

  const addLine = useCallback(
    (line: Line, options: AddLineOptions = {}) => {
      setLines((prev) => addLineToCollection(prev, line));

      if (options.select) {
        setSelectedLineIds((prev) => [line.id]);
        if (options.openModal) {
          setIsModalOpen(true);
        }
      }
    },
    []
  );

  const updateLineProperties = useCallback((lineId: string, updates: Partial<Line>) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === lineId ? updateLinePropertiesService(line, updates) : line
      )
    );
  }, []);

  const batchUpdateLines = useCallback((lineIds: string[], updates: Partial<Line>) => {
    setLines((prev) => batchUpdateLinesService(prev, lineIds, updates));
  }, []);

  const removeLinesById = useCallback((lineIds: string[]) => {
    if (lineIds.length === 0) return;
    const idSet = new Set(lineIds);
    setLines((prev) => removeLinesFromCollection(prev, lineIds));
    setSelectedLineIds((prev) => {
      const next = prev.filter((id) => !idSet.has(id));
      if (next.length === 0) {
        setIsModalOpen(false);
      }
      return next;
    });
  }, []);

  const removeSelectedLines = useCallback(() => {
    if (selectedLineIds.length === 0) return;
    setLines((prev) => removeLinesFromCollection(prev, selectedLineIds));
    setSelectedLineIds([]);
    setIsModalOpen(false);
  }, [selectedLineIds]);

  const duplicateSelectedLines = useCallback(
    (offset: { x: number; y: number } = { x: 20, y: 20 }) => {
      if (selectedLines.length === 0) return;

      const duplicates = selectedLines.map((line) => duplicateLine(line, offset));

      setLines((prev) => [...prev, ...duplicates]);
      setSelectedLineIds(duplicates.map((line) => line.id));
    },
    [selectedLines]
  );

  const selectLine = useCallback(
    (lineId: string, options: SelectLineOptions = {}) => {
      const shouldOpenModal = options.openModal ?? true;
      setSelectedLineIds((prev) => {
        if (options.multiSelect) {
          if (prev.includes(lineId)) {
            const next = prev.filter((id) => id !== lineId);
            if (next.length === 0) {
              setIsModalOpen(false);
            }
            return next;
          }
          const next = [...prev, lineId];
          if (shouldOpenModal) {
            setIsModalOpen(true);
          }
          return next;
        }

        if (shouldOpenModal) {
          setIsModalOpen(true);
        }
        return [lineId];
      });
    },
    []
  );

  const setSelection = useCallback(
    (lineIds: string[], options?: { openModal?: boolean }) => {
      setSelectedLineIds(lineIds);
      if (lineIds.length === 0) {
        setIsModalOpen(false);
      } else if (options?.openModal) {
        setIsModalOpen(true);
      }
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectedLineIds([]);
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    if (selectedLineIds.length === 0) return;
    setIsModalOpen(true);
  }, [selectedLineIds.length]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const setModalOpen = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);

  const updateLineLength = useCallback((lineId: string, newLengthPixels: number) => {
    setLines((prev) => updateLineLengthInCollection(prev, lineId, newLengthPixels));
  }, []);

  const updateLineColor = useCallback((lineId: string, color: string) => {
    setLines((prev) => updateLineColorInCollection(prev, lineId, color));
  }, []);

  const updateSelectedLineWidth = useCallback(
    (lineId: string, updater: (width: number) => number) => {
      setLines((prev) => updateLineWidthInCollection(prev, lineId, updater));
    },
    []
  );

  return {
    lines,
    selectedLines,
    selectedLineIds,
    isModalOpen,
    hasSelection,
    connections,
    getConnectedEndpoints,
    addLine,
    replaceLines,
    updateLines,
    updateLine,
    updateLineProperties,
    batchUpdateLines,
    removeLinesById,
    removeSelectedLines,
    duplicateSelectedLines,
    updateSelectedLineWidth,
    selectLine,
    setSelection,
    clearSelection,
    openModal,
    closeModal,
    setModalOpen,
    updateLineLength,
    updateLineColor,
  };
}
