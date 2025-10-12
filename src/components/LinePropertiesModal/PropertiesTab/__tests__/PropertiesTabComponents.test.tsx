/**
 * PropertiesTab Components Test Suite
 * 
 * Comprehensive tests for all PropertiesTab components including:
 * - TypeDropdown
 * - WidthDropdown
 * - WidthChips
 * - LengthDisplay
 * - ExpandableSection
 * - LayerDropdown
 * - MaterialDropdown
 * - GaugeDropdown
 * - PropertiesTab (integration)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypeDropdown } from '../TypeDropdown';
import { WidthDropdown } from '../WidthDropdown';
import { WidthChips } from '../WidthChips';
import { LengthDisplay } from '../LengthDisplay';
import { ExpandableSection } from '../ExpandableSection';
import { LayerDropdown } from '../LayerDropdown';
import { MaterialDropdown } from '../MaterialDropdown';
import { GaugeDropdown } from '../GaugeDropdown';
import type { Line } from '../../../../types/drawing.types';

describe('PropertiesTab Components', () => {
  describe('TypeDropdown', () => {
    it('should render with Supply selected', () => {
      render(<TypeDropdown value="supply" onChange={vi.fn()} />);
      
      expect(screen.getByText('Supply')).toBeInTheDocument();
    });

    it('should render with Return selected', () => {
      render(<TypeDropdown value="return" onChange={vi.fn()} />);
      
      expect(screen.getByText('Return')).toBeInTheDocument();
    });

    it('should call onChange when option selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<TypeDropdown value="supply" onChange={handleChange} />);
      
      // Open dropdown
      await user.click(screen.getByRole('button'));
      
      // Select Return option
      await user.click(screen.getByText('Return'));
      
      expect(handleChange).toHaveBeenCalledWith('return');
    });

    it('should be disabled when disabled=true', () => {
      render(<TypeDropdown value="supply" onChange={vi.fn()} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render label "Type"', () => {
      render(<TypeDropdown value="supply" onChange={vi.fn()} />);
      
      expect(screen.getByText('Type')).toBeInTheDocument();
    });

    it('should set aria-label for accessibility', () => {
      render(<TypeDropdown value="supply" onChange={vi.fn()} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Duct type selector');
    });
  });

  describe('WidthChips', () => {
    it('should render all 5 quick-select chips', () => {
      render(<WidthChips currentWidth={8} onWidthChange={vi.fn()} />);
      
      expect(screen.getByText('6"')).toBeInTheDocument();
      expect(screen.getByText('8"')).toBeInTheDocument();
      expect(screen.getByText('10"')).toBeInTheDocument();
      expect(screen.getByText('12"')).toBeInTheDocument();
      expect(screen.getByText('14"')).toBeInTheDocument();
    });

    it('should highlight active chip matching current width', () => {
      render(<WidthChips currentWidth={10} onWidthChange={vi.fn()} />);
      
      const chip10 = screen.getByText('10"').closest('button');
      expect(chip10).toHaveClass('bg-blue-600');
    });

    it('should call onWidthChange when chip clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<WidthChips currentWidth={8} onWidthChange={handleChange} />);
      
      await user.click(screen.getByText('12"'));
      
      expect(handleChange).toHaveBeenCalledWith(12);
    });

    it('should not call onWidthChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<WidthChips currentWidth={8} onWidthChange={handleChange} disabled={true} />);
      
      await user.click(screen.getByText('12"'));
      
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should set aria-label for group', () => {
      render(<WidthChips currentWidth={8} onWidthChange={vi.fn()} />);
      
      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'Quick width selection');
    });
  });

  describe('LengthDisplay', () => {
    const mockLine: Line = {
      id: 'test-line',
      a: { x: 0, y: 0 },
      b: { x: 100, y: 0 },
      width: 8,
      color: '#2563eb',
      type: 'supply',
      layer: 'Default',
      material: 'Galvanized Steel',
      gauge: '26ga',
      airflow: 500,
      notes: '',
      tags: [],
      customProperties: {},
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    it('should render label "Length"', () => {
      render(<LengthDisplay line={mockLine} />);
      
      expect(screen.getByText('Length')).toBeInTheDocument();
    });

    it('should display formatted length', () => {
      render(<LengthDisplay line={mockLine} />);
      
      // Should display some length value (exact value depends on formatLength utility)
      const lengthText = screen.getByText(/\(measured\)/);
      expect(lengthText).toBeInTheDocument();
    });

    it('should display "(measured)" suffix', () => {
      render(<LengthDisplay line={mockLine} />);
      
      expect(screen.getByText('(measured)')).toBeInTheDocument();
    });

    it('should set aria-label for accessibility', () => {
      render(<LengthDisplay line={mockLine} />);
      
      const lengthElement = screen.getByText(/\(measured\)/).closest('p');
      expect(lengthElement).toHaveAttribute('aria-label');
    });
  });

  describe('ExpandableSection', () => {
    it('should render toggle button', () => {
      render(
        <ExpandableSection expanded={false} onToggle={vi.fn()}>
          <div>Content</div>
        </ExpandableSection>
      );
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show "More Details" when collapsed', () => {
      render(
        <ExpandableSection expanded={false} onToggle={vi.fn()}>
          <div>Content</div>
        </ExpandableSection>
      );
      
      expect(screen.getByText('More Details')).toBeInTheDocument();
    });

    it('should show "Less Details" when expanded', () => {
      render(
        <ExpandableSection expanded={true} onToggle={vi.fn()}>
          <div>Content</div>
        </ExpandableSection>
      );
      
      expect(screen.getByText('Less Details')).toBeInTheDocument();
    });

    it('should call onToggle when button clicked', async () => {
      const handleToggle = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ExpandableSection expanded={false} onToggle={handleToggle}>
          <div>Content</div>
        </ExpandableSection>
      );
      
      await user.click(screen.getByRole('button'));
      
      expect(handleToggle).toHaveBeenCalled();
    });

    it('should set aria-expanded on button', () => {
      const { rerender } = render(
        <ExpandableSection expanded={false} onToggle={vi.fn()}>
          <div>Content</div>
        </ExpandableSection>
      );

      const button = screen.getByRole('button', { name: /more details/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      rerender(
        <ExpandableSection expanded={true} onToggle={vi.fn()}>
          <div>Content</div>
        </ExpandableSection>
      );

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should set aria-label on button', () => {
      render(
        <ExpandableSection expanded={false} onToggle={vi.fn()}>
          <div>Content</div>
        </ExpandableSection>
      );

      const button = screen.getByRole('button', { name: /show more details/i });
      expect(button).toHaveAttribute('aria-label', 'Show more details');
    });

    it('should hide content when collapsed', () => {
      render(
        <ExpandableSection expanded={false} onToggle={vi.fn()}>
          <div data-testid="content">Hidden Content</div>
        </ExpandableSection>
      );

      // Get the wrapper div (parentElement.parentElement because of nested structure)
      const content = screen.getByTestId('content').parentElement?.parentElement;
      expect(content).toHaveAttribute('aria-hidden', 'true');
    });

    it('should show content when expanded', () => {
      render(
        <ExpandableSection expanded={true} onToggle={vi.fn()}>
          <div data-testid="content">Visible Content</div>
        </ExpandableSection>
      );

      // Get the wrapper div (parentElement.parentElement because of nested structure)
      const content = screen.getByTestId('content').parentElement?.parentElement;
      expect(content).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('WidthDropdown', () => {
    it('should render with selected width', () => {
      render(<WidthDropdown value={8} onChange={vi.fn()} />);

      expect(screen.getByText('8"')).toBeInTheDocument();
    });

    it('should call onChange when width selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<WidthDropdown value={8} onChange={handleChange} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Select 12" option
      await user.click(screen.getByText('12"'));

      expect(handleChange).toHaveBeenCalledWith(12);
    });

    it('should be disabled when disabled=true', () => {
      render(<WidthDropdown value={8} onChange={vi.fn()} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render label "Width"', () => {
      render(<WidthDropdown value={8} onChange={vi.fn()} />);

      expect(screen.getByText('Width')).toBeInTheDocument();
    });

    it('should include "Custom..." option', async () => {
      const user = userEvent.setup();

      render(<WidthDropdown value={8} onChange={vi.fn()} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Should have Custom option
      expect(screen.getByText('Custom...')).toBeInTheDocument();
    });
  });

  describe('LayerDropdown', () => {
    it('should render label "Layer"', () => {
      render(<LayerDropdown value="Default" onChange={vi.fn()} />);

      expect(screen.getByText('Layer')).toBeInTheDocument();
    });

    it('should call onChange when layer selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<LayerDropdown value="Default" onChange={handleChange} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Select Supply layer (use getAllByText since it appears in both trigger and menu)
      const supplyOptions = screen.getAllByText('Supply');
      await user.click(supplyOptions[supplyOptions.length - 1]);

      expect(handleChange).toHaveBeenCalledWith('Supply');
    });

    it('should be disabled when disabled=true', () => {
      render(<LayerDropdown value="Default" onChange={vi.fn()} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should include all layer options', async () => {
      const user = userEvent.setup();

      render(<LayerDropdown value="Default" onChange={vi.fn()} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Should have all layer options (use getAllByText for "Default" since it appears twice)
      expect(screen.getAllByText('Default').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Supply').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Return').length).toBeGreaterThan(0);
      expect(screen.getByText('Exhaust')).toBeInTheDocument();
      expect(screen.getByText('Fresh Air')).toBeInTheDocument();
    });
  });

  describe('MaterialDropdown', () => {
    it('should render with selected material', () => {
      render(<MaterialDropdown value="Galvanized Steel" onChange={vi.fn()} />);

      expect(screen.getByText('Galvanized Steel')).toBeInTheDocument();
    });

    it('should call onChange when material selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<MaterialDropdown value="Galvanized Steel" onChange={handleChange} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Select Aluminum
      await user.click(screen.getByText('Aluminum'));

      expect(handleChange).toHaveBeenCalledWith('Aluminum');
    });

    it('should be disabled when disabled=true', () => {
      render(<MaterialDropdown value="Galvanized Steel" onChange={vi.fn()} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render label "Material"', () => {
      render(<MaterialDropdown value="Galvanized Steel" onChange={vi.fn()} />);

      expect(screen.getByText('Material')).toBeInTheDocument();
    });
  });

  describe('GaugeDropdown', () => {
    it('should render with selected gauge', () => {
      render(<GaugeDropdown value="26ga" onChange={vi.fn()} />);

      // Gauge displays as "26 ga" (with space)
      expect(screen.getByText('26 ga')).toBeInTheDocument();
    });

    it('should call onChange when gauge selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<GaugeDropdown value="26ga" onChange={handleChange} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Select 22 ga (with space)
      await user.click(screen.getByText('22 ga'));

      expect(handleChange).toHaveBeenCalledWith('22ga');
    });

    it('should be disabled when disabled=true', () => {
      render(<GaugeDropdown value="26ga" onChange={vi.fn()} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render label "Gauge"', () => {
      render(<GaugeDropdown value="26ga" onChange={vi.fn()} />);

      expect(screen.getByText('Gauge')).toBeInTheDocument();
    });

    it('should display thickness helper text', () => {
      render(<GaugeDropdown value="26ga" onChange={vi.fn()} />);

      // Should show thickness (JavaScript drops trailing zeros: 0.019)
      expect(screen.getByText('(0.019" thick)')).toBeInTheDocument();
    });

    it('should update thickness when gauge changes', () => {
      const { rerender } = render(<GaugeDropdown value="26ga" onChange={vi.fn()} />);

      expect(screen.getByText('(0.019" thick)')).toBeInTheDocument();

      rerender(<GaugeDropdown value="22ga" onChange={vi.fn()} />);

      // JavaScript drops trailing zero: 0.030 becomes 0.03
      expect(screen.getByText('(0.03" thick)')).toBeInTheDocument();
    });
  });
});

