/**
 * AdvancedTab Components Tests
 * 
 * Comprehensive tests for all AdvancedTab components:
 * - MetadataDisplay
 * - NotesTextarea
 * - TagChip
 * - TagsManager
 * - CustomProperty
 * - CustomPropertiesManager
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetadataDisplay } from '../MetadataDisplay';
import { NotesTextarea } from '../NotesTextarea';
import { TagChip } from '../TagChip';
import { TagsManager } from '../TagsManager';
import { CustomProperty } from '../CustomProperty';
import { CustomPropertiesManager } from '../CustomPropertiesManager';

describe('AdvancedTab Components', () => {
  describe('MetadataDisplay', () => {
    const mockTimestamp = 1697123456789; // Oct 12, 2023, 9:44:16 PM
    const mockLineId = 'a3f82b1c-4d5e-6f7g-8h9i-0j1k2l3m4n5o';

    it('should render line ID (first 8 characters)', () => {
      render(
        <MetadataDisplay
          lineId={mockLineId}
          createdAt={mockTimestamp}
          updatedAt={mockTimestamp}
        />
      );
      
      expect(screen.getByText('ID:')).toBeInTheDocument();
      expect(screen.getByText('a3f82b1c')).toBeInTheDocument();
    });

    it('should render created timestamp', () => {
      render(
        <MetadataDisplay
          lineId={mockLineId}
          createdAt={mockTimestamp}
          updatedAt={mockTimestamp}
        />
      );
      
      expect(screen.getByText('Created:')).toBeInTheDocument();
      // Timestamp format varies by locale, just check it exists
      expect(screen.getByText(/Created:/i).nextSibling).toBeTruthy();
    });

    it('should render updated timestamp', () => {
      render(
        <MetadataDisplay
          lineId={mockLineId}
          createdAt={mockTimestamp}
          updatedAt={mockTimestamp}
        />
      );
      
      expect(screen.getByText('Updated:')).toBeInTheDocument();
      // Timestamp format varies by locale, just check it exists
      expect(screen.getByText(/Updated:/i).nextSibling).toBeTruthy();
    });

    it('should set aria-label for accessibility', () => {
      render(
        <MetadataDisplay
          lineId={mockLineId}
          createdAt={mockTimestamp}
          updatedAt={mockTimestamp}
        />
      );
      
      const region = screen.getByRole('region', { name: /line metadata/i });
      expect(region).toBeInTheDocument();
    });
  });

  describe('NotesTextarea', () => {
    it('should render with current notes value', () => {
      render(<NotesTextarea value="Test notes" onChange={vi.fn()} />);
      
      const textarea = screen.getByRole('textbox', { name: /notes/i });
      expect(textarea).toHaveValue('Test notes');
    });

    it('should render label "Notes"', () => {
      render(<NotesTextarea value="" onChange={vi.fn()} />);
      
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    it('should call onChange when value changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<NotesTextarea value="" onChange={onChange} />);
      
      const textarea = screen.getByRole('textbox', { name: /notes/i });
      await user.type(textarea, 'New note');
      
      expect(onChange).toHaveBeenCalled();
    });

    it('should be disabled when disabled=true', () => {
      render(<NotesTextarea value="" onChange={vi.fn()} disabled={true} />);
      
      const textarea = screen.getByRole('textbox', { name: /notes/i });
      expect(textarea).toBeDisabled();
    });

    it('should display character counter', () => {
      render(<NotesTextarea value="Hello" onChange={vi.fn()} />);
      
      // Counter shows "5/120" (NOTE_MAX_LENGTH is 120)
      expect(screen.getByText('5/120')).toBeInTheDocument();
    });

    it('should enforce maximum character limit', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const longText = 'a'.repeat(120); // Exactly at limit
      render(<NotesTextarea value={longText} onChange={onChange} />);
      
      const textarea = screen.getByRole('textbox', { name: /notes/i });
      await user.type(textarea, 'x'); // Try to exceed limit
      
      // onChange should not be called for the extra character
      // The textarea has maxLength attribute which prevents typing beyond limit
      expect(textarea).toHaveAttribute('maxLength', '120');
    });

    it('should show warning color when near limit (90%)', () => {
      const nearLimitText = 'a'.repeat(108); // 90% of 120
      render(<NotesTextarea value={nearLimitText} onChange={vi.fn()} />);
      
      const counter = screen.getByText('108/120');
      expect(counter).toHaveClass('text-amber-600');
    });

    it('should show error color when at limit', () => {
      const atLimitText = 'a'.repeat(120);
      render(<NotesTextarea value={atLimitText} onChange={vi.fn()} />);
      
      const counter = screen.getByText('120/120');
      expect(counter).toHaveClass('text-red-600');
    });

    it('should have aria-describedby for character counter', () => {
      render(<NotesTextarea value="Test" onChange={vi.fn()} />);
      
      const textarea = screen.getByRole('textbox', { name: /notes/i });
      expect(textarea).toHaveAttribute('aria-describedby', 'notes-counter');
    });
  });

  describe('TagChip', () => {
    it('should render tag label', () => {
      render(<TagChip label="Kitchen" onRemove={vi.fn()} />);
      
      expect(screen.getByText('Kitchen')).toBeInTheDocument();
    });

    it('should call onRemove when remove button clicked', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(<TagChip label="Kitchen" onRemove={onRemove} />);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledOnce();
    });

    it('should be disabled when disabled=true', () => {
      render(<TagChip label="Kitchen" onRemove={vi.fn()} disabled={true} />);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('TagsManager', () => {
    it('should render label "Tags"', () => {
      render(<TagsManager tags={[]} onTagsChange={vi.fn()} />);
      
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('should render existing tags as chips', () => {
      render(<TagsManager tags={['Kitchen', 'Bedroom']} onTagsChange={vi.fn()} />);
      
      expect(screen.getByText('Kitchen')).toBeInTheDocument();
      expect(screen.getByText('Bedroom')).toBeInTheDocument();
    });

    it('should render "Add tag" button', () => {
      render(<TagsManager tags={[]} onTagsChange={vi.fn()} />);
      
      expect(screen.getByRole('button', { name: /add new tag/i })).toBeInTheDocument();
    });

    it('should show input when "Add tag" button clicked', async () => {
      const user = userEvent.setup();
      render(<TagsManager tags={[]} onTagsChange={vi.fn()} />);
      
      const addButton = screen.getByRole('button', { name: /add new tag/i });
      await user.click(addButton);
      
      expect(screen.getByRole('textbox', { name: /new tag name/i })).toBeInTheDocument();
    });

    it('should add new tag when Add button clicked', async () => {
      const user = userEvent.setup();
      const onTagsChange = vi.fn();
      render(<TagsManager tags={[]} onTagsChange={onTagsChange} />);
      
      // Click "Add tag" button
      await user.click(screen.getByRole('button', { name: /add new tag/i }));
      
      // Type tag name
      const input = screen.getByRole('textbox', { name: /new tag name/i });
      await user.type(input, 'NewTag');
      
      // Click "Add" button
      await user.click(screen.getByRole('button', { name: /^add tag$/i }));
      
      expect(onTagsChange).toHaveBeenCalledWith(['NewTag']);
    });

    it('should add new tag when Enter key pressed', async () => {
      const user = userEvent.setup();
      const onTagsChange = vi.fn();
      render(<TagsManager tags={[]} onTagsChange={onTagsChange} />);
      
      // Click "Add tag" button
      await user.click(screen.getByRole('button', { name: /add new tag/i }));
      
      // Type tag name and press Enter
      const input = screen.getByRole('textbox', { name: /new tag name/i });
      await user.type(input, 'NewTag{Enter}');
      
      expect(onTagsChange).toHaveBeenCalledWith(['NewTag']);
    });

    it('should cancel add when Cancel button clicked', async () => {
      const user = userEvent.setup();
      render(<TagsManager tags={[]} onTagsChange={vi.fn()} />);
      
      // Click "Add tag" button
      await user.click(screen.getByRole('button', { name: /add new tag/i }));
      
      // Click "Cancel" button
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      
      // Input should be hidden
      expect(screen.queryByRole('textbox', { name: /new tag name/i })).not.toBeInTheDocument();
    });

    it('should cancel add when Escape key pressed', async () => {
      const user = userEvent.setup();
      render(<TagsManager tags={[]} onTagsChange={vi.fn()} />);
      
      // Click "Add tag" button
      await user.click(screen.getByRole('button', { name: /add new tag/i }));
      
      // Press Escape
      const input = screen.getByRole('textbox', { name: /new tag name/i });
      await user.type(input, '{Escape}');
      
      // Input should be hidden
      expect(screen.queryByRole('textbox', { name: /new tag name/i })).not.toBeInTheDocument();
    });

    it('should prevent duplicate tags', async () => {
      const user = userEvent.setup();
      const onTagsChange = vi.fn();
      render(<TagsManager tags={['Existing']} onTagsChange={onTagsChange} />);
      
      // Try to add duplicate tag
      await user.click(screen.getByRole('button', { name: /add new tag/i }));
      const input = screen.getByRole('textbox', { name: /new tag name/i });
      await user.type(input, 'Existing{Enter}');
      
      // onTagsChange should not be called
      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it('should trim whitespace from new tags', async () => {
      const user = userEvent.setup();
      const onTagsChange = vi.fn();
      render(<TagsManager tags={[]} onTagsChange={onTagsChange} />);
      
      await user.click(screen.getByRole('button', { name: /add new tag/i }));
      const input = screen.getByRole('textbox', { name: /new tag name/i });
      await user.type(input, '  Trimmed  {Enter}');
      
      expect(onTagsChange).toHaveBeenCalledWith(['Trimmed']);
    });

    it('should remove tag when remove button clicked', async () => {
      const user = userEvent.setup();
      const onTagsChange = vi.fn();
      render(<TagsManager tags={['Kitchen', 'Bedroom']} onTagsChange={onTagsChange} />);
      
      // Find and click remove button for "Kitchen"
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);
      
      expect(onTagsChange).toHaveBeenCalledWith(['Bedroom']);
    });
  });

  describe('CustomProperty', () => {
    it('should render property key and value', () => {
      render(<CustomProperty propertyKey="Job" value="2025-1042" onRemove={vi.fn()} />);
      
      expect(screen.getByText(/Job:/i)).toBeInTheDocument();
      expect(screen.getByText(/2025-1042/i)).toBeInTheDocument();
    });

    it('should show remove button on hover', async () => {
      const user = userEvent.setup();
      render(<CustomProperty propertyKey="Job" value="2025-1042" onRemove={vi.fn()} />);
      
      const property = screen.getByRole('listitem');
      await user.hover(property);
      
      expect(screen.getByRole('button', { name: /remove job property/i })).toBeInTheDocument();
    });

    it('should call onRemove when remove button clicked', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(<CustomProperty propertyKey="Job" value="2025-1042" onRemove={onRemove} />);

      const property = screen.getByRole('listitem');

      // Use fireEvent for mouse events to trigger hover state
      fireEvent.mouseEnter(property);

      // Wait for button to appear after hover
      const removeButton = await screen.findByRole('button', { name: /remove job property/i });
      await user.click(removeButton);

      expect(onRemove).toHaveBeenCalledOnce();
    });
  });

  describe('CustomPropertiesManager', () => {
    it('should render label "Custom Properties"', () => {
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);
      
      expect(screen.getByText('Custom Properties')).toBeInTheDocument();
    });

    it('should render existing properties', () => {
      const properties = { Job: '2025-1042', Floor: '2nd' };
      render(<CustomPropertiesManager properties={properties} onPropertiesChange={vi.fn()} />);
      
      expect(screen.getByText(/Job:/i)).toBeInTheDocument();
      expect(screen.getByText(/2025-1042/i)).toBeInTheDocument();
      expect(screen.getByText(/Floor:/i)).toBeInTheDocument();
      expect(screen.getByText(/2nd/i)).toBeInTheDocument();
    });

    it('should show empty state when no properties', () => {
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);
      
      expect(screen.getByText('No custom properties')).toBeInTheDocument();
    });

    it('should render "Add property" button', () => {
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: /add new property/i })).toBeInTheDocument();
    });

    it('should show inputs when "Add property" button clicked', async () => {
      const user = userEvent.setup();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);

      const addButton = screen.getByRole('button', { name: /add new property/i });
      await user.click(addButton);

      expect(screen.getByRole('textbox', { name: /property name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /property value/i })).toBeInTheDocument();
    });

    it('should add new property when Add button clicked', async () => {
      const user = userEvent.setup();
      const onPropertiesChange = vi.fn();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={onPropertiesChange} />);

      // Click "Add property" button
      await user.click(screen.getByRole('button', { name: /add new property/i }));

      // Type property name and value
      const nameInput = screen.getByRole('textbox', { name: /property name/i });
      const valueInput = screen.getByRole('textbox', { name: /property value/i });
      await user.type(nameInput, 'Job');
      await user.type(valueInput, '2025-1042');

      // Click "Add" button
      await user.click(screen.getByRole('button', { name: /^add property$/i }));

      expect(onPropertiesChange).toHaveBeenCalledWith({ Job: '2025-1042' });
    });

    it('should add new property when Enter key pressed', async () => {
      const user = userEvent.setup();
      const onPropertiesChange = vi.fn();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={onPropertiesChange} />);

      // Click "Add property" button
      await user.click(screen.getByRole('button', { name: /add new property/i }));

      // Type property name and value, then press Enter
      const nameInput = screen.getByRole('textbox', { name: /property name/i });
      const valueInput = screen.getByRole('textbox', { name: /property value/i });
      await user.type(nameInput, 'Job');
      await user.type(valueInput, '2025-1042{Enter}');

      expect(onPropertiesChange).toHaveBeenCalledWith({ Job: '2025-1042' });
    });

    it('should cancel add when Cancel button clicked', async () => {
      const user = userEvent.setup();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);

      // Click "Add property" button
      await user.click(screen.getByRole('button', { name: /add new property/i }));

      // Click "Cancel" button
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Inputs should be hidden
      expect(screen.queryByRole('textbox', { name: /property name/i })).not.toBeInTheDocument();
    });

    it('should cancel add when Escape key pressed', async () => {
      const user = userEvent.setup();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);

      // Click "Add property" button
      await user.click(screen.getByRole('button', { name: /add new property/i }));

      // Press Escape
      const nameInput = screen.getByRole('textbox', { name: /property name/i });
      await user.type(nameInput, '{Escape}');

      // Inputs should be hidden
      expect(screen.queryByRole('textbox', { name: /property name/i })).not.toBeInTheDocument();
    });

    it('should prevent duplicate property keys', async () => {
      const user = userEvent.setup();
      const onPropertiesChange = vi.fn();
      render(<CustomPropertiesManager properties={{ Job: '2025-1042' }} onPropertiesChange={onPropertiesChange} />);

      // Try to add duplicate key
      await user.click(screen.getByRole('button', { name: /add new property/i }));
      const nameInput = screen.getByRole('textbox', { name: /property name/i });
      const valueInput = screen.getByRole('textbox', { name: /property value/i });
      await user.type(nameInput, 'Job');
      await user.type(valueInput, 'NewValue{Enter}');

      // onPropertiesChange should not be called
      expect(onPropertiesChange).not.toHaveBeenCalled();
    });

    it('should trim whitespace from property key and value', async () => {
      const user = userEvent.setup();
      const onPropertiesChange = vi.fn();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={onPropertiesChange} />);

      await user.click(screen.getByRole('button', { name: /add new property/i }));
      const nameInput = screen.getByRole('textbox', { name: /property name/i });
      const valueInput = screen.getByRole('textbox', { name: /property value/i });
      await user.type(nameInput, '  Job  ');
      await user.type(valueInput, '  2025-1042  {Enter}');

      expect(onPropertiesChange).toHaveBeenCalledWith({ Job: '2025-1042' });
    });

    it('should disable Add button when property name is empty', async () => {
      const user = userEvent.setup();
      render(<CustomPropertiesManager properties={{}} onPropertiesChange={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /add new property/i }));

      const addButton = screen.getByRole('button', { name: /^add property$/i });
      expect(addButton).toBeDisabled();
    });

    it('should remove property when remove button clicked', async () => {
      const user = userEvent.setup();
      const onPropertiesChange = vi.fn();
      const properties = { Job: '2025-1042', Floor: '2nd' };
      render(<CustomPropertiesManager properties={properties} onPropertiesChange={onPropertiesChange} />);

      // Hover over first property to show remove button
      const propertyItems = screen.getAllByRole('listitem');

      // Use fireEvent for mouse events to trigger hover state
      fireEvent.mouseEnter(propertyItems[0]);

      // Wait for button to appear after hover, then click
      const removeButton = await screen.findByRole('button', { name: /remove job property/i });
      await user.click(removeButton);

      expect(onPropertiesChange).toHaveBeenCalledWith({ Floor: '2nd' });
    });
  });
});
