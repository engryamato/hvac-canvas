/**
 * TagsManager Component
 * 
 * Manages tags for a line with add/remove functionality.
 * Displays existing tags as chips and provides an add button.
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TagChip } from './TagChip';
import { Button } from '../shared';

/**
 * Props for TagsManager component
 */
export interface TagsManagerProps {
  /** Current tags array */
  tags: string[];
  /** Change handler for tags */
  onTagsChange: (tags: string[]) => void;
  /** Whether manager is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * TagsManager Component
 * 
 * Manages a collection of tags with add/remove operations.
 * 
 * Features:
 * - Display existing tags as TagChip components
 * - Flex wrap layout with 4px gap
 * - "+ Add tag" button (28px height, dashed border)
 * - Inline input dialog for adding new tags
 * - Enter to add, Escape to cancel
 * - Prevents duplicate tags
 * - Trims whitespace
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <TagsManager
 *   tags={line.tags}
 *   onTagsChange={(tags) => updateLine({ tags })}
 * />
 * ```
 */
export function TagsManager(props: TagsManagerProps): JSX.Element {
  const { tags, onTagsChange, disabled = false, className = '' } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  /**
   * Handle add tag
   */
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setNewTag('');
      setIsAdding(false);
    }
  };

  /**
   * Handle remove tag
   */
  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  /**
   * Handle cancel add
   */
  const handleCancelAdd = () => {
    setNewTag('');
    setIsAdding(false);
  };

  /**
   * Handle key press in input
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-xs font-medium text-neutral-600 mb-2">
        Tags
      </label>

      {/* Tags Display */}
      <div className="flex flex-wrap items-center gap-1" role="list" aria-label="Tags">
        {/* Existing Tags */}
        {tags.map((tag) => (
          <TagChip
            key={tag}
            label={tag}
            onRemove={() => handleRemoveTag(tag)}
            disabled={disabled}
          />
        ))}

        {/* Add Tag Input (inline) */}
        {isAdding ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tag name..."
              autoFocus
              className="h-6 px-2 text-xs text-neutral-900 bg-white border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="New tag name"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="h-6 px-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              aria-label="Add tag"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleCancelAdd}
              className="h-6 px-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        ) : (
          /* Add Tag Button */
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            disabled={disabled}
            className="h-7 px-3 text-xs font-medium text-neutral-600 bg-white border border-dashed border-neutral-300 rounded hover:bg-neutral-50 hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add new tag"
          >
            <Plus className="inline w-3 h-3 mr-1" />
            Add tag
          </button>
        )}
      </div>
    </div>
  );
}

