/**
 * BottomBar Component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomBar } from '../BottomBar';

describe('BottomBar', () => {
  it('should render zoom controls', () => {
    render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onResetZoom={vi.fn()}
      />
    );
    
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /reset zoom/i })).toBeDefined();
  });

  it('should display zoom percentage', () => {
    const { rerender } = render(
      <BottomBar
        zoom={1.0}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
      />
    );
    
    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
    await user.click(zoomOutButton);
    
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it('should call onResetZoom when reset button clicked', async () => {
    const onResetZoom = vi.fn();
    const user = userEvent.setup();
    
    render(
      <BottomBar
        zoom={1.5}
        canZoomIn={true}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onResetZoom={onResetZoom}
      />
    );
    
    const resetButton = screen.getByRole('button', { name: /reset zoom/i });
    await user.click(resetButton);
    
    expect(onResetZoom).toHaveBeenCalledTimes(1);
  });

  it('should disable zoom in button when canZoomIn is false', () => {
    render(
      <BottomBar
        zoom={5.0}
        canZoomIn={false}
        canZoomOut={true}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
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
        onResetZoom={vi.fn()}
      />
    );
    
    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
    const resetButton = screen.getByRole('button', { name: /reset zoom/i });
    
    expect(zoomInButton.getAttribute('title')).toBe('Zoom In (+)');
    expect(zoomOutButton.getAttribute('title')).toBe('Zoom Out (-)');
    expect(resetButton.getAttribute('title')).toBe('Reset Zoom (0)');
  });
});

