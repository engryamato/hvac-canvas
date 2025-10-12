/**
 * Dropdown Component
 * 
 * Generic dropdown component with keyboard navigation, animations, and accessibility.
 * Used across all tabs for selecting values from a list of options.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Dropdown option interface
 */
export interface DropdownOption<T = any> {
  /** Display label for the option */
  label: string;
  /** Value of the option */
  value: T;
  /** Optional icon or indicator to show next to label */
  icon?: React.ReactNode;
}

/**
 * Props for Dropdown component
 */
export interface DropdownProps<T = any> {
  /** Current selected value */
  value: T;
  /** Array of options to display */
  options: DropdownOption<T>[];
  /** Callback when value changes */
  onChange: (value: T) => void;
  /** Optional label text above dropdown */
  label?: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * Dropdown Component
 * 
 * A fully accessible dropdown with keyboard navigation and smooth animations.
 * 
 * Features:
 * - 32px height with 4px border radius
 * - Chevron icon (up when open, down when closed)
 * - 150ms open/close animation
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Max-height 224px (7 items visible)
 * - Scrollable menu with 2px scrollbar
 * - Focus trap when open
 * - ARIA labels for screen readers
 * 
 * @param props - Component props
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   value={selectedType}
 *   options={[
 *     { label: 'Supply', value: 'supply' },
 *     { label: 'Return', value: 'return' }
 *   ]}
 *   onChange={(value) => setSelectedType(value)}
 *   label="Type"
 *   placeholder="Select type..."
 * />
 * ```
 */
export function Dropdown<T = any>(props: DropdownProps<T>): JSX.Element {
  const {
    value,
    options,
    onChange,
    label,
    placeholder = 'Select...',
    disabled = false,
    className = '',
    ariaLabel,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Find the selected option
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  /**
   * Close dropdown and reset focus
   */
  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  /**
   * Handle option selection
   */
  const selectOption = (option: DropdownOption<T>) => {
    onChange(option.value);
    closeDropdown();
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.findIndex((opt) => opt.value === value));
        } else if (focusedIndex >= 0) {
          selectOption(options[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;

      case 'Home':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(0);
        }
        break;

      case 'End':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(options.length - 1);
        }
        break;

      default:
        break;
    }
  };

  /**
   * Handle click outside to close dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  /**
   * Scroll focused option into view
   */
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const focusedElement = menuRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex, isOpen]);

  const ChevronIcon = isOpen ? ChevronUp : ChevronDown;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-neutral-600 mb-2">
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={[
          'w-full h-8 px-3 flex items-center justify-between',
          'text-sm text-neutral-900',
          'bg-white border rounded',
          isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-neutral-300',
          disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : 'hover:border-neutral-400',
          'transition-all duration-150',
          'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
        ].join(' ')}
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-500'}>
          {displayText}
        </span>
        <ChevronIcon className="w-3 h-3 text-neutral-600 flex-shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          aria-label={`${label || 'Dropdown'} options`}
          className={[
            'absolute z-50 w-full mt-1',
            'bg-white border border-neutral-300 rounded',
            'shadow-lg',
            'max-h-56 overflow-y-auto',
            'animate-in fade-in slide-in-from-top-1 duration-150',
          ].join(' ')}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6',
          }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isFocused = index === focusedIndex;

            return (
              <div
                key={index}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={[
                  'h-8 px-3 flex items-center gap-2',
                  'text-sm cursor-pointer',
                  'transition-colors duration-100',
                  isSelected ? 'bg-blue-50 text-blue-900 font-medium' : 'text-neutral-900',
                  isFocused && !isSelected ? 'bg-neutral-100' : '',
                  !isSelected && !isFocused ? 'hover:bg-neutral-50' : '',
                ].join(' ')}
              >
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                <span className="flex-1">{option.label}</span>
                {isSelected && (
                  <span className="text-blue-600 text-xs">✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

