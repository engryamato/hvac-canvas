/**
 * CustomPropertiesManager Component
 * 
 * Manages custom properties for a line with add/remove functionality.
 * Displays existing properties and provides an add button.
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CustomProperty } from './CustomProperty';

/**
 * Props for CustomPropertiesManager component
 */
export interface CustomPropertiesManagerProps {
  /** Current custom properties object */
  properties: Record<string, string>;
  /** Change handler for properties */
  onPropertiesChange: (properties: Record<string, string>) => void;
  /** Whether manager is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * CustomPropertiesManager Component
 * 
 * Manages a collection of custom properties with add/remove operations.
 * 
 * Features:
 * - Display existing properties using CustomProperty components
 * - "+ Add property" button (28px height)
 * - Inline dialog for adding new properties (key and value fields)
 * - Validates non-empty key
 * - Prevents duplicate keys
 * - Trims whitespace
 * - Enter to add, Escape to cancel
 * - Accessible with ARIA labels
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <CustomPropertiesManager
 *   properties={line.customProperties}
 *   onPropertiesChange={(props) => updateLine({ customProperties: props })}
 * />
 * ```
 */
export function CustomPropertiesManager(props: CustomPropertiesManagerProps): JSX.Element {
  const { properties, onPropertiesChange, disabled = false, className = '' } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  /**
   * Handle add property
   */
  const handleAddProperty = () => {
    const trimmedKey = newKey.trim();
    const trimmedValue = newValue.trim();

    if (trimmedKey && !properties.hasOwnProperty(trimmedKey)) {
      onPropertiesChange({
        ...properties,
        [trimmedKey]: trimmedValue,
      });
      setNewKey('');
      setNewValue('');
      setIsAdding(false);
    }
  };

  /**
   * Handle remove property
   */
  const handleRemoveProperty = (keyToRemove: string) => {
    const newProperties = { ...properties };
    delete newProperties[keyToRemove];
    onPropertiesChange(newProperties);
  };

  /**
   * Handle cancel add
   */
  const handleCancelAdd = () => {
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  /**
   * Handle key press in inputs
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProperty();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  // Get property entries
  const propertyEntries = Object.entries(properties);

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-xs font-medium text-neutral-600 mb-2">
        Custom Properties
      </label>

      {/* Properties List */}
      <div className="space-y-1" role="list" aria-label="Custom properties">
        {/* Existing Properties */}
        {propertyEntries.map(([key, value]) => (
          <CustomProperty
            key={key}
            propertyKey={key}
            value={value}
            onRemove={() => handleRemoveProperty(key)}
            disabled={disabled}
          />
        ))}

        {/* Empty State */}
        {propertyEntries.length === 0 && !isAdding && (
          <p className="text-xs text-neutral-400 italic p-2">
            No custom properties
          </p>
        )}
      </div>

      {/* Add Property Form (inline) */}
      {isAdding ? (
        <div className="mt-2 p-2 bg-neutral-50 rounded border border-neutral-200">
          <div className="space-y-2">
            {/* Key Input */}
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Property name..."
              autoFocus
              className="w-full h-7 px-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Property name"
            />

            {/* Value Input */}
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Property value..."
              className="w-full h-7 px-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Property value"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAddProperty}
                disabled={!newKey.trim()}
                className="h-6 px-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add property"
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
          </div>
        </div>
      ) : (
        /* Add Property Button */
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={disabled}
          className="mt-2 h-7 px-3 text-xs font-medium text-neutral-600 bg-white border border-dashed border-neutral-300 rounded hover:bg-neutral-50 hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add new property"
        >
          <Plus className="inline w-3 h-3 mr-1" />
          Add property
        </button>
      )}
    </div>
  );
}

