import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { currencies, fromMajor, type Currency } from '../domain/money';
import type { Expense, Participant } from '../domain/settlements';
import type { NewExpense } from '../features/splitfx/splitFxSlice';
import { Button } from './Button';
import { trapTabKey } from './dialogFocus';
import { Icon } from './Icon';

interface AddExpenseDialogProps {
  readonly participants: readonly Participant[];
  readonly onClose: () => void;
  readonly onSubmit: (expense: NewExpense) => void;
}

export function AddExpenseDialog({ participants, onClose, onSubmit }: AddExpenseDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [paidBy, setPaidBy] = useState(participants[0]?.id ?? '');
  const [sharedBy, setSharedBy] = useState<string[]>(participants.map(({ id }) => id));
  const [category, setCategory] = useState<Expense['category']>('food');
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    descriptionInputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (dialogRef.current) {
        trapTabKey(event, dialogRef.current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const toggleParticipant = (participantId: string) => {
    setSharedBy((current) =>
      current.includes(participantId)
        ? current.filter((id) => id !== participantId)
        : [...current, participantId],
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = Number(amount);

    if (description.trim().length < 2) {
      setError('Add a short description so the group can recognise this expense.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
      setError('Enter an amount greater than 0 and below 100,000.');
      return;
    }
    if (!paidBy || sharedBy.length === 0) {
      setError('Choose who paid and at least one person sharing the expense.');
      return;
    }

    onSubmit({
      description: description.trim(),
      amount: fromMajor(parsedAmount, currency),
      paidBy,
      sharedBy,
      category,
    });
  };

  return (
    <div
      className="dialog-backdrop dialog-backdrop--lab"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="expense-dialog"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="expense-dialog__header">
          <div>
            <span className="lab-eyebrow">New group expense</span>
            <h2 id={titleId}>What did you pay for?</h2>
          </div>
          <button
            aria-label="Close add expense dialog"
            className="lab-icon-button"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </header>

        <form className="expense-form" onSubmit={submit}>
          <label className="field field--wide">
            <span>Description</span>
            <input
              autoComplete="off"
              maxLength={48}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Rooftop dinner"
              ref={descriptionInputRef}
              value={description}
            />
          </label>

          <div className="field-row">
            <label className="field field--amount">
              <span>Amount</span>
              <span className="money-input">
                <strong>{currency}</strong>
                <input
                  aria-label="Amount"
                  inputMode="decimal"
                  min="0.01"
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  value={amount}
                />
              </span>
            </label>
            <label className="field">
              <span>Currency</span>
              <select
                onChange={(event) => setCurrency(event.target.value as Currency)}
                value={currency}
              >
                {currencies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Paid by</span>
              <select onChange={(event) => setPaidBy(event.target.value)} value={paidBy}>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Category</span>
              <select
                onChange={(event) => setCategory(event.target.value as Expense['category'])}
                value={category}
              >
                <option value="food">Food</option>
                <option value="stay">Stay</option>
                <option value="travel">Travel</option>
                <option value="experience">Experience</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <fieldset className="share-fieldset">
            <legend>Split between</legend>
            <div className="participant-toggles">
              {participants.map((participant) => {
                const selected = sharedBy.includes(participant.id);
                return (
                  <label
                    className={selected ? 'participant-toggle is-selected' : 'participant-toggle'}
                    key={participant.id}
                  >
                    <input
                      checked={selected}
                      onChange={() => toggleParticipant(participant.id)}
                      type="checkbox"
                    />
                    <span
                      style={{ '--participant-colour': participant.colour } as React.CSSProperties}
                    >
                      {selected ? <Icon name="check" size={14} /> : participant.initials}
                    </span>
                    {participant.name}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <footer className="expense-dialog__footer">
            <p>
              <Icon name="shield" size={16} /> Stored as integer minor units.
            </p>
            <div>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button icon="plus" type="submit">
                Add expense
              </Button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
