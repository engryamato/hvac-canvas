/**
 * AdvancedTab Component
 * 
 * Main Advanced tab component that handles metadata, notes, tags, and custom properties.
 * Displays read-only metadata and editable notes, tags, and custom properties.
 */

import React from 'react';
import type { Line } from '../../../types/drawing.types';
import { MetadataDisplay } from './MetadataDisplay';
import { NotesTextarea } from './NotesTextarea';
import { TagsManager } from './TagsManager';
import { CustomPropertiesManager } from './CustomPropertiesManager';
import { Section } from '../shared';

/**
 * Props for AdvancedTab component
 */
export interface AdvancedTabProps {
  /** Line being edited */
  line: Line;
  /** Update handler for line properties */
  onUpdate: (updates: Partial<Line>) => void;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * AdvancedTab Component
 * 
 * The main Advanced tab that displays metadata, notes, tags, and custom properties.
 * 
 * Features:
 * - **Metadata Section**: Read-only display of line ID and timestamps
 * - **Notes Section**: Textarea with 120 character limit and counter
 * - **Tags Section**: Tag management with add/remove functionality
 * - **Custom Properties Section**: Key-value pair management
 * - 360px height
 * - Proper spacing and layout per wireframes
 * - Uses Section components for consistent grouping
 * 
 * Layout:
 * ```
 * ┌─────────────────────────────┐
 * │ Metadata                    │
 * │ ┌─────────────────────────┐ │
 * │ │ ID: a3f82b1c            │ │
 * │ │ Created: Oct 12, 9:45 PM│ │
 * │ │ Updated: Oct 13, 2:36 PM│ │
 * │ └─────────────────────────┘ │
 * │                             │
 * │ Notes                       │
 * │ ┌─────────────────────────┐ │
 * │ │ [Textarea]              │ │
 * │ └─────────────────────────┘ │
 * │ 45/120                      │
 * │                             │
 * │ Tags                        │
 * │ [Kitchen][Bedroom][+ Add]   │
 * │                             │
 * │ Custom Properties           │
 * │ Job: 2025-1042              │
 * │ Floor: 2                    │
 * │ [+ Add property]            │
 * └─────────────────────────────┘
 * ```
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <AdvancedTab
 *   line={selectedLine}
 *   onUpdate={(updates) => updateLineProperties(selectedLine, updates)}
 * />
 * ```
 */
export function AdvancedTab(props: AdvancedTabProps): JSX.Element {
  const { line, onUpdate, disabled = false, className = '' } = props;

  /**
   * Handle notes change
   */
  const handleNotesChange = (notes: string) => {
    onUpdate({ notes });
  };

  /**
   * Handle tags change
   */
  const handleTagsChange = (tags: string[]) => {
    onUpdate({ tags });
  };

  /**
   * Handle custom properties change
   */
  const handlePropertiesChange = (customProperties: Record<string, string>) => {
    onUpdate({ customProperties });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Metadata Section (Read-only) */}
      <Section title="Metadata">
        <MetadataDisplay
          lineId={line.id}
          createdAt={line.metadata.createdAt}
          updatedAt={line.metadata.updatedAt}
        />
      </Section>

      {/* Notes Section */}
      <Section title="Notes">
        <NotesTextarea
          value={line.notes || ''}
          onChange={handleNotesChange}
          disabled={disabled}
        />
      </Section>

      {/* Tags Section */}
      <Section title="Tags">
        <TagsManager
          tags={line.tags || []}
          onTagsChange={handleTagsChange}
          disabled={disabled}
        />
      </Section>

      {/* Custom Properties Section */}
      <Section title="Custom Properties">
        <CustomPropertiesManager
          properties={line.customProperties || {}}
          onPropertiesChange={handlePropertiesChange}
          disabled={disabled}
        />
      </Section>
    </div>
  );
}

