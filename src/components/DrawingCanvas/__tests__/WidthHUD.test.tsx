/**
 * WidthHUD Component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WidthHUD } from '../WidthHUD';
import type { Line } from '../../../types';

describe('WidthHUD', () => {
  const mockLine: Line = {
    id: 'line1',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 100 },
    width: 8,
    color: '#111827'
  };

  const mockPosition = { x: 100, y: 50 };

  it('should not render when no line is selected', () => {
    const { container } = render(
      <WidthHUD
        selectedLine={null}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when no position is provided', () => {
    const { container } = render(
      <WidthHUD
        selectedLine={mockLine}
        position={null}
        onWidthChange={vi.fn()}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should render when line and position are provided', () => {
    render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('Width')).toBeDefined();
    expect(screen.getByText('8px')).toBeDefined();
  });

  it('should display current line width', () => {
    const { rerender } = render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('8px')).toBeDefined();
    
    const updatedLine = { ...mockLine, width: 12 };
    rerender(
      <WidthHUD
        selectedLine={updatedLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('12px')).toBeDefined();
  });

  it('should call onWidthChange when slider changes', () => {
    const onWidthChange = vi.fn();

    render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={onWidthChange}
      />
    );

    const slider = screen.getByRole('slider', { name: /selected line width/i }) as HTMLInputElement;

    // Simulate slider change
    fireEvent.change(slider, { target: { value: '15' } });

    // Verify onWidthChange was called with the new value
    expect(onWidthChange).toHaveBeenCalledWith(15);
  });

  it('should position HUD at specified coordinates', () => {
    const { container } = render(
      <WidthHUD
        selectedLine={mockLine}
        position={{ x: 200, y: 150 }}
        onWidthChange={vi.fn()}
      />
    );
    
    const hud = container.firstChild as HTMLElement;
    expect(hud.style.left).toBe('200px');
    expect(hud.style.top).toBe('150px');
  });

  it('should have slider with correct range', () => {
    render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('min')).toBe('1');
    expect(slider.getAttribute('max')).toBe('60');
  });

  it('should have slider with current width value', () => {
    render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('value')).toBe('8');
  });

  it('should have correct ARIA attributes', () => {
    render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
      />
    );
    
    const hud = screen.getByRole('dialog');
    expect(hud.getAttribute('aria-label')).toBe('Line width editor');
    
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-label')).toBe('Selected line width');
  });

  it('should accept hudRef prop', () => {
    const hudRef = { current: null };
    
    render(
      <WidthHUD
        selectedLine={mockLine}
        position={mockPosition}
        onWidthChange={vi.fn()}
        hudRef={hudRef}
      />
    );
    
    expect(hudRef.current).not.toBeNull();
  });
});

