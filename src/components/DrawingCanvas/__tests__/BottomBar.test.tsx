/**
 * BottomBar Component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomBar } from '../BottomBar';
import type { Scale } from '../../../types';

const mockScale: Scale = {
  type: 'custom',
  pixelsPerInch: 1,
  displayName: '1:1',
  unit: 'imperial'
};

const mockScaleOptions: Scale[] = [
  { type: 'custom', pixelsPerInch: 1, displayName: '1:1', unit: 'imperial' },
  { type: 'architectural', pixelsPerInch: 1/48, displayName: '1/4" = 1\'-0"', unit: 'imperial' },
  { type: 'engineering', pixelsPerInch: 1/120, displayName: '1" = 10\'', unit: 'imperial' },
];

describe('BottomBar', () => {
  it('should render zoom controls', () => {
    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /zoom out/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeDefined();
  });

  it('should display zoom percentage', () => {
    const { rerender } = render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    expect(screen.getByText('100%')).toBeDefined();

    rerender(
      <BottomBar
        zoom={1.5}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    expect(screen.getByText('150%')).toBeDefined();

    rerender(
      <BottomBar
        zoom={0.5}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    expect(screen.getByText('50%')).toBeDefined();
  });

  it('should call onZoomIn when zoom in button clicked', async () => {
    const onZoomIn = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={onZoomIn}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    await user.click(zoomInButton);

    expect(onZoomIn).toHaveBeenCalledTimes(1);
  });

  it('should call onZoomOut when zoom out button clicked', async () => {
    const onZoomOut = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={onZoomOut}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
    await user.click(zoomOutButton);

    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it('should call onScaleChange when scale selector is changed', async () => {
    const onScaleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={onScaleChange}
      />
    );

    const scaleSelector = screen.getByRole('combobox', { name: /select drawing scale/i });
    await user.selectOptions(scaleSelector, '1/4" = 1\'-0"');

    expect(onScaleChange).toHaveBeenCalledTimes(1);
    expect(onScaleChange).toHaveBeenCalledWith(mockScaleOptions[1]);
  });

  it('should disable zoom in button when canZoomIn is false', () => {
    render(
      <BottomBar
        zoom={5.0}
        canZoomIn={false}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    expect(zoomInButton.hasAttribute('disabled')).toBe(true);
  });

  it('should disable zoom out button when canZoomOut is false', () => {
    render(
      <BottomBar
        zoom={0.1}
        canZoomIn={true}
        canZoomOut={false}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
    expect(zoomOutButton.hasAttribute('disabled')).toBe(true);
  });

  it('should display pan instruction text', () => {
    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    expect(screen.getByText(/right-click \+ drag to pan/i)).toBeDefined();
  });

  it('should have correct button titles', () => {
    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });

    expect(zoomInButton.getAttribute('title')).toBe('Zoom In (+)');
    expect(zoomOutButton.getAttribute('title')).toBe('Zoom Out (-)');
  });

  it('should render scale selector with all options', () => {
    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScale}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const scaleSelector = screen.getByRole('combobox', { name: /select drawing scale/i });
    expect(scaleSelector).toBeDefined();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(mockScaleOptions.length);
  });

  it('should display current scale in selector', () => {
    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        currentScale={mockScaleOptions[1]}
        scaleOptions={mockScaleOptions}
        onScaleChange={vi.fn()}
      />
    );

    const scaleSelector = screen.getByRole('combobox', { name: /select drawing scale/i }) as HTMLSelectElement;
    expect(scaleSelector.value).toBe('1/4" = 1\'-0"');
  });
});

