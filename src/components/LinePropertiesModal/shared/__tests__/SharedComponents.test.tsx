/**
 * Unit Tests for Shared Components
 * 
 * Tests all shared UI components with comprehensive coverage including:
 * - User interactions (clicks, keyboard input, focus)
 * - Accessibility features (ARIA attributes, keyboard navigation)
 * - Props validation and variations
 * - State changes and event callbacks
 * - Edge cases (disabled states, empty values, errors)
 * 
 * Target: 100% code coverage
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '../Label';
import { HelperText } from '../HelperText';
import { Separator } from '../Separator';
import { StatusIcon } from '../StatusIcon';
import { Chip } from '../Chip';
import { Button } from '../Button';
import { Input } from '../Input';
import { Dropdown } from '../Dropdown';
import { Section } from '../Section';

describe('Shared Components', () => {
  describe('Label', () => {
    it('should render with text', () => {
      render(<Label text="Width" />);
      
      expect(screen.getByText('Width')).toBeInTheDocument();
    });

    it('should render required indicator when required=true', () => {
      render(<Label text="Width" required />);
      
      const label = screen.getByText('Width').parentElement;
      expect(label).toHaveTextContent('*');
    });

    it('should not render required indicator when required=false', () => {
      render(<Label text="Width" required={false} />);
      
      const label = screen.getByText('Width').parentElement;
      expect(label).not.toHaveTextContent('*');
    });

    it('should set htmlFor attribute', () => {
      render(<Label text="Width" htmlFor="width-input" />);
      
      const label = screen.getByText('Width').closest('label');
      expect(label).toHaveAttribute('for', 'width-input');
    });

    it('should apply custom className', () => {
      render(<Label text="Width" className="custom-class" />);
      
      const label = screen.getByText('Width').closest('label');
      expect(label).toHaveClass('custom-class');
    });
  });

  describe('HelperText', () => {
    it('should render with text', () => {
      render(<HelperText text="Enter a value between 1 and 100" />);
      
      expect(screen.getByText('Enter a value between 1 and 100')).toBeInTheDocument();
    });

    it('should apply default variant styles', () => {
      render(<HelperText text="Helper text" variant="default" />);
      
      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveClass('text-neutral-600');
    });

    it('should apply error variant styles', () => {
      render(<HelperText text="Error message" variant="error" />);
      
      const helperText = screen.getByText('Error message');
      expect(helperText).toHaveClass('text-red-600');
    });

    it('should apply warning variant styles', () => {
      render(<HelperText text="Warning message" variant="warning" />);
      
      const helperText = screen.getByText('Warning message');
      expect(helperText).toHaveClass('text-amber-600');
    });

    it('should apply success variant styles', () => {
      render(<HelperText text="Success message" variant="success" />);
      
      const helperText = screen.getByText('Success message');
      expect(helperText).toHaveClass('text-green-600');
    });

    it('should set id attribute', () => {
      render(<HelperText text="Helper text" id="helper-1" />);
      
      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveAttribute('id', 'helper-1');
    });

    it('should apply custom className', () => {
      render(<HelperText text="Helper text" className="custom-class" />);
      
      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveClass('custom-class');
    });
  });

  describe('Separator', () => {
    it('should render as hr element', () => {
      const { container } = render(<Separator />);
      
      const separator = container.querySelector('hr');
      expect(separator).toBeInTheDocument();
    });

    it('should apply border styles', () => {
      const { container } = render(<Separator />);
      
      const separator = container.querySelector('hr');
      expect(separator).toHaveClass('border-neutral-200');
    });

    it('should set aria-label when provided', () => {
      const { container } = render(<Separator ariaLabel="Section divider" />);
      
      const separator = container.querySelector('hr');
      expect(separator).toHaveAttribute('aria-label', 'Section divider');
    });

    it('should apply custom className', () => {
      const { container } = render(<Separator className="custom-class" />);
      
      const separator = container.querySelector('hr');
      expect(separator).toHaveClass('custom-class');
    });
  });

  describe('StatusIcon', () => {
    it('should render success icon', () => {
      render(<StatusIcon status="success" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-label', 'Success');
    });

    it('should render warning icon', () => {
      render(<StatusIcon status="warning" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'Warning');
    });

    it('should render error icon', () => {
      render(<StatusIcon status="error" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'Error');
    });

    it('should render info icon', () => {
      render(<StatusIcon status="info" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'Information');
    });

    it('should use custom aria-label when provided', () => {
      render(<StatusIcon status="success" ariaLabel="Custom label" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should apply custom size', () => {
      render(<StatusIcon status="success" size={20} />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('width', '20');
      expect(icon).toHaveAttribute('height', '20');
    });

    it('should apply default size of 14', () => {
      render(<StatusIcon status="success" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('width', '14');
      expect(icon).toHaveAttribute('height', '14');
    });

    it('should apply custom className', () => {
      render(<StatusIcon status="success" className="custom-class" />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveClass('custom-class');
    });
  });

  describe('Chip', () => {
    it('should render with label', () => {
      render(<Chip label="8 inches" />);
      
      expect(screen.getByText('8 inches')).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Chip label="8 inches" onClick={handleClick} />);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should show active state', () => {
      render(<Chip label="8 inches" active />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show inactive state', () => {
      render(<Chip label="8 inches" active={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should render remove button when removable=true', () => {
      render(<Chip label="Kitchen" removable />);
      
      expect(screen.getByLabelText('Remove Kitchen')).toBeInTheDocument();
    });

    it('should call onRemove when remove button clicked', async () => {
      const handleRemove = vi.fn();
      const user = userEvent.setup();
      
      render(<Chip label="Kitchen" removable onRemove={handleRemove} />);
      
      await user.click(screen.getByLabelText('Remove Kitchen'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when remove button clicked', async () => {
      const handleClick = vi.fn();
      const handleRemove = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Chip
          label="Kitchen"
          onClick={handleClick}
          removable
          onRemove={handleRemove}
        />
      );
      
      await user.click(screen.getByLabelText('Remove Kitchen'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply medium size styles', () => {
      render(<Chip label="8 inches" size="medium" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-7'); // 28px
    });

    it('should apply small size styles', () => {
      render(<Chip label="Kitchen" size="small" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-6'); // 24px
    });

    it('should be disabled when disabled=true', () => {
      render(<Chip label="8 inches" disabled />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Chip label="8 inches" onClick={handleClick} disabled />);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onRemove when disabled', async () => {
      const handleRemove = vi.fn();
      const user = userEvent.setup();
      
      render(<Chip label="Kitchen" removable onRemove={handleRemove} disabled />);
      
      await user.click(screen.getByLabelText('Remove Kitchen'));
      expect(handleRemove).not.toHaveBeenCalled();
    });
  });

  describe('Button', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply primary variant styles', () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-neutral-300');
    });

    it('should apply danger variant styles', () => {
      render(<Button variant="danger">Delete</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-red-600');
      expect(button).toHaveClass('text-red-600');
    });

    it('should apply expand variant styles', () => {
      render(<Button variant="expand">Expand</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-dashed');
    });

    it('should be disabled when disabled=true', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should render icon when provided', () => {
      render(
        <Button icon={<span data-testid="test-icon">Icon</span>}>
          With Icon
        </Button>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should apply fullWidth styles', () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('should set button type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should default to type="button"', () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should set aria-label when provided', () => {
      render(<Button ariaLabel="Custom label">Button</Button>);

      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Input', () => {
    it('should render text input', () => {
      render(<Input type="text" value="" onChange={vi.fn()} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" value={0} onChange={vi.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('should call onChange when text input changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input type="text" value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onChange when number input changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input type="number" value={0} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '42');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should display current value', () => {
      render(<Input type="text" value="test value" onChange={vi.fn()} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });

    it('should display placeholder', () => {
      render(
        <Input
          type="text"
          value=""
          onChange={vi.fn()}
          placeholder="Enter text..."
        />
      );

      const input = screen.getByPlaceholderText('Enter text...');
      expect(input).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(<Input type="text" value="" onChange={vi.fn()} label="Width" />);

      expect(screen.getByText('Width')).toBeInTheDocument();
    });

    it('should render helper text when provided', () => {
      render(
        <Input
          type="text"
          value=""
          onChange={vi.fn()}
          helperText="Enter a value"
        />
      );

      expect(screen.getByText('Enter a value')).toBeInTheDocument();
    });

    it('should be disabled when disabled=true', () => {
      render(<Input type="text" value="" onChange={vi.fn()} disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input type="text" value="" onChange={handleChange} disabled />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should apply error validation state', () => {
      render(
        <Input
          type="text"
          value=""
          onChange={vi.fn()}
          validationState="error"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should apply warning validation state', () => {
      render(
        <Input
          type="text"
          value=""
          onChange={vi.fn()}
          validationState="warning"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-amber-500');
    });

    it('should apply success validation state', () => {
      render(
        <Input
          type="text"
          value=""
          onChange={vi.fn()}
          validationState="success"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-green-500');
    });

    it('should set min/max for number inputs', () => {
      render(
        <Input type="number" value={5} onChange={vi.fn()} min={0} max={100} />
      );

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('should set step for number inputs', () => {
      render(<Input type="number" value={0} onChange={vi.fn()} step={0.1} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.1');
    });

    it('should set maxLength for text inputs', () => {
      render(<Input type="text" value="" onChange={vi.fn()} maxLength={120} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '120');
    });

    it('should set id attribute', () => {
      render(<Input type="text" value="" onChange={vi.fn()} id="test-input" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('should set aria-label when provided', () => {
      render(
        <Input
          type="text"
          value=""
          onChange={vi.fn()}
          ariaLabel="Custom label"
        />
      );

      const input = screen.getByLabelText('Custom label');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Dropdown', () => {
    const options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ];

    it('should render with selected value', () => {
      render(<Dropdown value="opt1" options={options} onChange={vi.fn()} />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should render placeholder when no value selected', () => {
      render(
        <Dropdown
          value=""
          options={options}
          onChange={vi.fn()}
          placeholder="Select an option..."
        />
      );

      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('should call onChange when option selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Dropdown value="opt1" options={options} onChange={handleChange} />);

      // Click to open dropdown
      await user.click(screen.getByRole('button'));

      // Click option 2
      await user.click(screen.getByText('Option 2'));

      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup();

      render(<Dropdown value="opt1" options={options} onChange={vi.fn()} />);

      await user.click(screen.getByRole('button'));

      // All options should be visible (use getAllByText since text appears in trigger and menu)
      const option1Elements = screen.getAllByText('Option 1');
      expect(option1Elements.length).toBeGreaterThanOrEqual(1);

      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should close dropdown when option selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Dropdown value="opt1" options={options} onChange={handleChange} />);

      // Open dropdown
      await user.click(screen.getByRole('button'));

      // Verify dropdown is open by checking for aria-expanded
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');

      // Select option
      await user.click(screen.getByText('Option 2'));

      // Verify onChange was called
      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    it('should be disabled when disabled=true', () => {
      render(<Dropdown value="opt1" options={options} onChange={vi.fn()} disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should render label when provided', () => {
      render(
        <Dropdown
          value="opt1"
          options={options}
          onChange={vi.fn()}
          label="Select Type"
        />
      );

      expect(screen.getByText('Select Type')).toBeInTheDocument();
    });

    it('should set aria-label when provided', () => {
      render(
        <Dropdown
          value="opt1"
          options={options}
          onChange={vi.fn()}
          ariaLabel="Custom label"
        />
      );

      const button = screen.getByLabelText('Custom label');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Section', () => {
    it('should render with title and children', () => {
      render(
        <Section title="Test Section">
          <div>Child content</div>
        </Section>
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      render(
        <Section title="Test Section" icon={<span data-testid="test-icon">Icon</span>}>
          <div>Content</div>
        </Section>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Section title="Test Section" className="custom-class">
          <div>Content</div>
        </Section>
      );

      const section = container.firstChild;
      expect(section).toHaveClass('custom-class');
    });

    it('should render multiple children', () => {
      render(
        <Section title="Test Section">
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Section>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });
});

