import { fireEvent, render, screen } from '@testing-library/react';
import type { Participant } from '../domain/settlements';
import { AddExpenseDialog } from './AddExpenseDialog';

const participants: Participant[] = [
  { id: 'rui', name: 'Rui', initials: 'RS', colour: '#c7ff63' },
  { id: 'maya', name: 'Maya', initials: 'MK', colour: '#8fa8ff' },
];

function renderDialog(overrides: Partial<React.ComponentProps<typeof AddExpenseDialog>> = {}) {
  const props = {
    participants,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    ...overrides,
  };

  return { ...render(<AddExpenseDialog {...props} />), props };
}

describe('AddExpenseDialog', () => {
  it('focuses the first field, closes with Escape, and restores the previous focus', () => {
    const previous = document.createElement('button');
    document.body.append(previous);
    previous.focus();

    const { props, unmount } = renderDialog();

    expect(screen.getByPlaceholderText(/rooftop dinner/i)).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(props.onClose).toHaveBeenCalledTimes(1);

    unmount();
    expect(previous).toHaveFocus();
    previous.remove();
  });

  it('keeps keyboard focus inside the modal when Tab reaches either edge', () => {
    renderDialog();
    const close = screen.getByRole('button', { name: /close add expense dialog/i });
    const submit = screen.getByRole('button', { name: /^add expense$/i });

    submit.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    close.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(submit).toHaveFocus();
  });

  it('supports the explicit close controls and only closes on the backdrop itself', () => {
    const { props } = renderDialog();
    const dialog = screen.getByRole('dialog', { name: /what did you pay for/i });
    const backdrop = dialog.parentElement;

    expect(backdrop).not.toBeNull();
    fireEvent.mouseDown(dialog);
    expect(props.onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(backdrop!);
    expect(props.onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /close add expense dialog/i }));
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(props.onClose).toHaveBeenCalledTimes(3);
  });

  it('explains invalid descriptions, amounts, and empty sharing selections', () => {
    const { props } = renderDialog();
    const submit = screen.getByRole('button', { name: /^add expense$/i });
    const form = submit.closest('form');
    const description = screen.getByLabelText(/description/i);
    const amount = screen.getByLabelText(/amount/i);

    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    expect(screen.getByRole('alert')).toHaveTextContent(/short description/i);

    fireEvent.change(description, { target: { value: 'Dinner' } });
    fireEvent.change(amount, { target: { value: '0' } });
    fireEvent.submit(form!);
    expect(screen.getByRole('alert')).toHaveTextContent(/greater than 0/i);

    fireEvent.change(amount, { target: { value: '100001' } });
    fireEvent.submit(form!);
    expect(screen.getByRole('alert')).toHaveTextContent(/below 100,000/i);

    fireEvent.change(amount, { target: { value: '42.50' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Rui' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Maya' }));
    fireEvent.submit(form!);
    expect(screen.getByRole('alert')).toHaveTextContent(/at least one person/i);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a valid-looking expense when no payer exists', () => {
    const { props } = renderDialog({ participants: [] });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Museum tickets' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '24' } });
    fireEvent.click(screen.getByRole('button', { name: /^add expense$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/choose who paid/i);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('normalises a complete mixed-currency expense before submitting it', () => {
    const { props } = renderDialog();

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: '  Design museum  ' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '12.35' } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'GBP' } });
    fireEvent.change(screen.getByLabelText(/paid by/i), { target: { value: 'maya' } });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'experience' },
    });

    const ruiShare = screen.getByRole('checkbox', { name: 'Rui' });
    fireEvent.click(ruiShare);
    expect(ruiShare).not.toBeChecked();
    fireEvent.click(ruiShare);
    expect(ruiShare).toBeChecked();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Maya' }));

    fireEvent.click(screen.getByRole('button', { name: /^add expense$/i }));

    expect(props.onSubmit).toHaveBeenCalledWith({
      description: 'Design museum',
      amount: { minor: 1235, currency: 'GBP' },
      paidBy: 'maya',
      sharedBy: ['rui'],
      category: 'experience',
    });
  });
});
