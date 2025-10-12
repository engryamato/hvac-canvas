/**
 * CalculationsTab Components Tests
 * 
 * Comprehensive tests for all CalculationsTab components:
 * - AirflowInput
 * - ResultRow
 * - ResultsDisplay
 * - WarningBanner
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AirflowInput } from '../AirflowInput';
import { ResultRow } from '../ResultRow';
import { ResultsDisplay } from '../ResultsDisplay';
import { WarningBanner } from '../WarningBanner';

describe('CalculationsTab Components', () => {
  describe('AirflowInput', () => {
    it('should render with current airflow value', () => {
      render(<AirflowInput value={500} onChange={vi.fn()} />);
      
      const input = screen.getByRole('spinbutton', { name: /airflow/i });
      expect(input).toHaveValue(500);
    });

    it('should render label "Airflow (CFM)"', () => {
      render(<AirflowInput value={500} onChange={vi.fn()} />);
      
      expect(screen.getByText('Airflow (CFM)')).toBeInTheDocument();
    });

    it('should call onChange when value changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<AirflowInput value={500} onChange={onChange} />);
      
      const input = screen.getByRole('spinbutton', { name: /airflow/i });
      await user.clear(input);
      await user.type(input, '750');
      
      expect(onChange).toHaveBeenCalled();
    });

    it('should be disabled when disabled=true', () => {
      render(<AirflowInput value={500} onChange={vi.fn()} disabled={true} />);
      
      const input = screen.getByRole('spinbutton', { name: /airflow/i });
      expect(input).toBeDisabled();
    });

    it('should show error state for negative values', () => {
      render(<AirflowInput value={-100} onChange={vi.fn()} />);
      
      expect(screen.getByText('Airflow cannot be negative')).toBeInTheDocument();
    });

    it('should have min=0 and step=1 attributes', () => {
      render(<AirflowInput value={500} onChange={vi.fn()} />);
      
      const input = screen.getByRole('spinbutton', { name: /airflow/i });
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('step', '1');
    });

    it('should set aria-label for accessibility', () => {
      render(<AirflowInput value={500} onChange={vi.fn()} />);
      
      const input = screen.getByRole('spinbutton', { name: /airflow in cubic feet per minute/i });
      expect(input).toBeInTheDocument();
    });
  });

  describe('ResultRow', () => {
    it('should render label and formatted value', () => {
      render(
        <ResultRow
          label="Velocity"
          value={1432}
          unit="fpm"
          precision={0}
        />
      );
      
      expect(screen.getByText('Velocity')).toBeInTheDocument();
      expect(screen.getByText('1,432 fpm')).toBeInTheDocument();
    });

    it('should format value with specified precision', () => {
      render(
        <ResultRow
          label="Friction"
          value={0.084}
          unit="in.wc/100ft"
          precision={2}
        />
      );
      
      expect(screen.getByText('0.08 in.wc/100ft')).toBeInTheDocument();
    });

    it('should display success status icon', () => {
      render(
        <ResultRow
          label="Velocity"
          value={1432}
          unit="fpm"
          status="success"
          precision={0}
        />
      );
      
      // StatusIcon with success status should be present
      const statusIcon = screen.getByLabelText(/velocity status: success/i);
      expect(statusIcon).toBeInTheDocument();
    });

    it('should display warning status icon', () => {
      render(
        <ResultRow
          label="Velocity"
          value={1650}
          unit="fpm"
          status="warning"
          precision={0}
        />
      );
      
      // StatusIcon with warning status should be present
      const statusIcon = screen.getByLabelText(/velocity status: warning/i);
      expect(statusIcon).toBeInTheDocument();
    });

    it('should not display status icon when status is undefined', () => {
      render(
        <ResultRow
          label="Friction"
          value={0.084}
          unit="in.wc/100ft"
          precision={2}
        />
      );
      
      // Should not have any status icon
      expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument();
    });

    it('should set aria-label with formatted result', () => {
      render(
        <ResultRow
          label="Velocity"
          value={1432}
          unit="fpm"
          precision={0}
        />
      );
      
      const row = screen.getByRole('row', { name: /velocity: 1,432 fpm/i });
      expect(row).toBeInTheDocument();
    });
  });

  describe('ResultsDisplay', () => {
    const mockResults = {
      velocity: 1432,
      friction: 0.084,
      pressure: 0.128,
    };

    it('should render "Results" section title', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      expect(screen.getByText('Results')).toBeInTheDocument();
    });

    it('should display all three calculation results', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      expect(screen.getByText('Velocity')).toBeInTheDocument();
      expect(screen.getByText('Friction')).toBeInTheDocument();
      expect(screen.getByText('Pressure')).toBeInTheDocument();
    });

    it('should format velocity with 0 decimal places', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      expect(screen.getByText('1,432 fpm')).toBeInTheDocument();
    });

    it('should format friction with 2 decimal places', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      expect(screen.getByText('0.08 in.wc/100ft')).toBeInTheDocument();
    });

    it('should format pressure with 2 decimal places', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      expect(screen.getByText('0.13 in')).toBeInTheDocument();
    });

    it('should show success status for velocity ≤ 1500 fpm', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      const statusIcon = screen.getByLabelText(/velocity status: success/i);
      expect(statusIcon).toBeInTheDocument();
    });

    it('should show warning status for velocity > 1500 fpm', () => {
      const highVelocityResults = {
        velocity: 1650,
        friction: 0.120,
        pressure: 0.170,
      };
      
      render(<ResultsDisplay results={highVelocityResults} />);
      
      const statusIcon = screen.getByLabelText(/velocity status: warning/i);
      expect(statusIcon).toBeInTheDocument();
    });

    it('should set aria-label for accessibility', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      const region = screen.getByRole('region', { name: /calculation results/i });
      expect(region).toBeInTheDocument();
    });

    it('should have aria-live="polite" for dynamic updates', () => {
      render(<ResultsDisplay results={mockResults} />);
      
      const region = screen.getByRole('region', { name: /calculation results/i });
      expect(region).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('WarningBanner', () => {
    it('should not render when velocity ≤ 1500 fpm', () => {
      const { container } = render(
        <WarningBanner
          velocity={1432}
          currentWidth={8}
          cfm={500}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('should render when velocity > 1500 fpm', () => {
      render(
        <WarningBanner
          velocity={1650}
          currentWidth={8}
          cfm={500}
        />
      );
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display formatted velocity in warning message', () => {
      render(
        <WarningBanner
          velocity={1650}
          currentWidth={8}
          cfm={500}
        />
      );
      
      expect(screen.getByText(/high velocity/i)).toBeInTheDocument();
      expect(screen.getByText(/1,650 fpm/i)).toBeInTheDocument();
    });

    it('should suggest optimal width to reduce velocity', () => {
      render(
        <WarningBanner
          velocity={1650}
          currentWidth={8}
          cfm={500}
        />
      );
      
      expect(screen.getByText(/suggest:/i)).toBeInTheDocument();
      expect(screen.getByText(/to reduce velocity/i)).toBeInTheDocument();
    });

    it('should have role="alert" for accessibility', () => {
      render(
        <WarningBanner
          velocity={1650}
          currentWidth={8}
          cfm={500}
        />
      );
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have aria-live="polite" for dynamic updates', () => {
      render(
        <WarningBanner
          velocity={1650}
          currentWidth={8}
          cfm={500}
        />
      );
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });
  });
});

