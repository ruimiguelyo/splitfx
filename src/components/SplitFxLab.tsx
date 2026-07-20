import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { convertMoney, formatMoney, formatSignedMoney } from '../domain/money';
import {
  selectBalances,
  selectParticipantMap,
  selectQuoteHealth,
  selectSettlementPlan,
  selectSplitFx,
  selectTripTotal,
  type QuoteHealth,
} from '../features/splitfx/selectors';
import {
  addExpense,
  expireQuote,
  refreshQuote,
  resetDemo,
  setNetwork,
  type NewExpense,
} from '../features/splitfx/splitFxSlice';
import { AddExpenseDialog } from './AddExpenseDialog';
import { Avatar, AvatarStack } from './Avatar';
import { Button } from './Button';
import { Icon } from './Icon';

interface SplitFxLabProps {
  readonly onBack: () => void;
}

const categorySymbol = {
  stay: '⌂',
  food: '⌁',
  travel: '↗',
  experience: '✦',
  other: '•',
} as const;

const quoteLabels: Record<QuoteHealth, { label: string; detail: string }> = {
  live: { label: 'Demo rate current', detail: 'Calculation ready to review.' },
  expired: { label: 'Quote expired', detail: 'Refresh before anyone sends money.' },
  offline: { label: 'You are offline', detail: 'The last calculation stays visible.' },
  loading: { label: 'Refreshing quote', detail: 'Checking the latest demo rates…' },
  error: { label: 'Refresh failed', detail: 'Previous calculation remains visible.' },
};

function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function SplitFxLab({ onBack }: SplitFxLabProps) {
  const dispatch = useAppDispatch();
  const splitFx = useAppSelector(selectSplitFx);
  const tripTotal = useAppSelector(selectTripTotal);
  const balances = useAppSelector(selectBalances);
  const settlements = useAppSelector(selectSettlementPlan);
  const participantMap = useAppSelector(selectParticipantMap);
  const [now, setNow] = useState(splitFx.quoteUpdatedAt);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'expenses'>('overview');
  const [explainedSettlementId, setExplainedSettlementId] = useState<string | null>(null);
  const quoteHealth = useAppSelector((state) => selectQuoteHealth(state, now));
  const quoteCopy = quoteLabels[quoteHealth];

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const orderedBalances = useMemo(
    () => [...balances].sort((a, b) => b.amount.minor - a.amount.minor),
    [balances],
  );

  const submitExpense = (expense: NewExpense) => {
    dispatch(addExpense(expense));
    setIsAddingExpense(false);
    setActiveView('expenses');
  };

  return (
    <div className="splitfx-lab" data-testid="splitfx-lab">
      <a className="skip-link" href="#lab-main">
        Skip to product
      </a>
      <header className="lab-header">
        <div className="lab-header__left">
          <button className="lab-back" onClick={onBack} type="button">
            <Icon name="back" size={18} /> Portfolio
          </button>
          <span className="lab-divider" />
          <a className="lab-brand" href="#/splitfx" aria-label="SplitFX home">
            <span>S</span> SplitFX
          </a>
          <span className="prototype-pill">Product prototype</span>
        </div>
        <div className="lab-header__right">
          <span className="demo-data-label">
            <Icon name="shield" size={15} /> Demo data
          </span>
          <button className="lab-reset" onClick={() => dispatch(resetDemo())} type="button">
            <Icon name="refresh" size={16} /> Reset
          </button>
          <Button icon="plus" onClick={() => setIsAddingExpense(true)}>
            Add expense
          </Button>
        </div>
      </header>

      <div className="lab-shell">
        <aside className="lab-sidebar">
          <div className="group-summary">
            <span className="group-summary__art" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div>
              <span>Current group</span>
              <strong>{splitFx.groupName}</strong>
              <small>
                {splitFx.participants.length} people · {splitFx.baseCurrency} base
              </small>
            </div>
            <AvatarStack participants={splitFx.participants} />
          </div>
          <nav aria-label="SplitFX views" className="lab-nav">
            <button
              className={activeView === 'overview' ? 'is-active' : ''}
              onClick={() => setActiveView('overview')}
              type="button"
            >
              <span>
                <Icon name="spark" size={18} /> Overview
              </span>
              <small>01</small>
            </button>
            <button
              className={activeView === 'expenses' ? 'is-active' : ''}
              onClick={() => setActiveView('expenses')}
              type="button"
            >
              <span>
                <Icon name="receipt" size={18} /> Expenses
              </span>
              <small>{splitFx.expenses.length.toString().padStart(2, '0')}</small>
            </button>
          </nav>
          <div className="lab-sidebar__note">
            <Icon name="shield" />
            <strong>Built for trust</strong>
            <p>Source amounts, demo conversions, and remainder rules stay inspectable.</p>
          </div>
          <p className="lab-disclaimer">
            Fixed demo rates · no real money, transfers, or live banking services.
          </p>
        </aside>

        <main className="lab-main" id="lab-main">
          <header className="lab-page-heading">
            <div>
              <span className="lab-eyebrow">
                {activeView === 'overview' ? 'Group overview' : 'Expense ledger'}
              </span>
              <h1>
                {activeView === 'overview' ? 'Make the split obvious.' : 'One source of truth.'}
              </h1>
              <p>
                {activeView === 'overview'
                  ? 'A compact plan, with every demo conversion visible before anyone pays.'
                  : 'Every item keeps its original currency, payer, and sharing rule.'}
              </p>
            </div>
            <div className="lab-page-heading__total">
              <span>Total in {splitFx.baseCurrency}</span>
              <strong>{formatMoney(tripTotal)}</strong>
              <small>
                {splitFx.expenses.length} expenses · {settlements.length} suggested transfers
              </small>
            </div>
          </header>

          <section aria-live="polite" className={`quote-banner quote-banner--${quoteHealth}`}>
            <span className="quote-banner__icon">
              <Icon
                name={
                  quoteHealth === 'offline'
                    ? 'wifiOff'
                    : quoteHealth === 'live'
                      ? 'shield'
                      : 'refresh'
                }
              />
            </span>
            <div>
              <strong>{quoteCopy.label}</strong>
              <p>{quoteCopy.detail}</p>
            </div>
            <div className="quote-banner__rates">
              <span>1 GBP = {(1 / splitFx.rates.GBP).toFixed(4)} EUR</span>
              <span>1 USD = {(1 / splitFx.rates.USD).toFixed(4)} EUR</span>
            </div>
            <div className="quote-banner__action">
              {quoteHealth === 'live' ? (
                <span className="quote-timer">
                  <i /> Expires in {formatCountdown(splitFx.quoteValidUntil - now)}
                </span>
              ) : (
                <button onClick={() => void dispatch(refreshQuote())} type="button">
                  <Icon name="refresh" size={16} /> Refresh quote
                </button>
              )}
            </div>
          </section>

          {splitFx.quoteError ? (
            <p className="lab-error" role="alert">
              {splitFx.quoteError}
            </p>
          ) : null}

          {activeView === 'overview' ? (
            <div className="lab-dashboard">
              <section className="settlement-panel" aria-labelledby="settlement-title">
                <header className="panel-heading">
                  <div>
                    <span className="panel-index">01</span>
                    <div>
                      <h2 id="settlement-title">Settlement plan</h2>
                      <p>Largest balances matched first.</p>
                    </div>
                  </div>
                  <span className="compact-pill">{settlements.length} transfers</span>
                </header>
                <div className="settlement-list">
                  {settlements.map((settlement, index) => {
                    const from = participantMap[settlement.from];
                    const to = participantMap[settlement.to];
                    if (!from || !to) return null;
                    return (
                      <article className="settlement-row" key={settlement.id}>
                        <span className="settlement-row__index">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="settlement-row__mobile">
                          <Avatar participant={from} />
                          <span>
                            <strong>{from.name}</strong>
                            <small>pays {to.name}</small>
                          </span>
                        </span>
                        <Avatar participant={from} />
                        <div className="settlement-row__person">
                          <strong>{from.name}</strong>
                          <small>pays</small>
                        </div>
                        <span className="settlement-row__path">
                          <i />
                          <Icon name="arrow" size={14} />
                        </span>
                        <Avatar participant={to} />
                        <div className="settlement-row__person">
                          <strong>{to.name}</strong>
                          <small>receives</small>
                        </div>
                        <strong className="settlement-row__amount">
                          {formatMoney(settlement.amount)}
                        </strong>
                        <button
                          aria-controls={`settlement-explanation-${settlement.id}`}
                          aria-expanded={explainedSettlementId === settlement.id}
                          aria-label={`Explain why ${from.name} pays ${to.name}`}
                          className="explain-button"
                          onClick={() =>
                            setExplainedSettlementId((current) =>
                              current === settlement.id ? null : settlement.id,
                            )
                          }
                          type="button"
                        >
                          Why?
                        </button>
                        {explainedSettlementId === settlement.id ? (
                          <p
                            className="settlement-explanation"
                            id={`settlement-explanation-${settlement.id}`}
                          >
                            {from.name}&apos;s negative net position is matched with {to.name}
                            &apos;s positive position. This suggested{' '}
                            {formatMoney(settlement.amount)} reduces both balances; it does not
                            initiate a transfer.
                          </p>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
                <footer className="panel-footer">
                  <span>
                    <Icon name="check" size={16} /> Net balances reach exactly{' '}
                    {formatMoney({ minor: 0, currency: splitFx.baseCurrency })}
                  </span>
                  <small>Deterministic greedy matching · documented trade-off</small>
                </footer>
              </section>

              <aside className="balance-panel" aria-labelledby="balance-title">
                <header className="panel-heading">
                  <div>
                    <span className="panel-index">02</span>
                    <div>
                      <h2 id="balance-title">Net position</h2>
                      <p>After shared costs.</p>
                    </div>
                  </div>
                </header>
                <div className="balance-list">
                  {orderedBalances.map((balance) => {
                    const participant = participantMap[balance.participantId];
                    if (!participant) return null;
                    const positive = balance.amount.minor >= 0;
                    return (
                      <div className="balance-row" key={balance.participantId}>
                        <Avatar participant={participant} size="small" />
                        <div>
                          <strong>{participant.name}</strong>
                          <small>{positive ? 'gets back' : 'owes'}</small>
                        </div>
                        <span className={positive ? 'is-positive' : 'is-negative'}>
                          {formatSignedMoney(balance.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="balance-visual" aria-hidden="true">
                  {orderedBalances.map((balance) => {
                    const participant = participantMap[balance.participantId];
                    const max = Math.max(
                      ...orderedBalances.map(({ amount }) => Math.abs(amount.minor)),
                    );
                    const width = max === 0 ? 0 : (Math.abs(balance.amount.minor) / max) * 100;
                    return participant ? (
                      <span
                        className={balance.amount.minor >= 0 ? 'is-positive' : 'is-negative'}
                        key={participant.id}
                      >
                        <i
                          style={
                            {
                              width: `${width}%`,
                              '--bar-colour': participant.colour,
                            } as React.CSSProperties
                          }
                        />
                      </span>
                    ) : null;
                  })}
                </div>
              </aside>

              <section className="state-lab" aria-labelledby="state-lab-title">
                <div>
                  <span className="lab-eyebrow">Prototype controls</span>
                  <h2 id="state-lab-title">Test the uncomfortable states.</h2>
                  <p>A trustworthy interface stays useful when the network does not.</p>
                </div>
                <div className="state-lab__buttons">
                  <button onClick={() => dispatch(expireQuote())} type="button">
                    <Icon name="refresh" /> Expire rate
                  </button>
                  <button
                    onClick={() =>
                      dispatch(setNetwork(splitFx.network === 'online' ? 'offline' : 'online'))
                    }
                    type="button"
                  >
                    <Icon name={splitFx.network === 'online' ? 'wifiOff' : 'check'} />
                    {splitFx.network === 'online' ? 'Go offline' : 'Reconnect'}
                  </button>
                  <button onClick={() => dispatch(resetDemo())} type="button">
                    <Icon name="shield" /> Restore demo
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <section className="expense-ledger" aria-labelledby="expense-ledger-title">
              <header className="panel-heading">
                <div>
                  <span className="panel-index">01</span>
                  <div>
                    <h2 id="expense-ledger-title">All expenses</h2>
                    <p>Original amounts stay untouched.</p>
                  </div>
                </div>
                <Button icon="plus" onClick={() => setIsAddingExpense(true)} variant="secondary">
                  Add another
                </Button>
              </header>
              <div className="expense-table" role="table" aria-label="Group expenses">
                <div className="expense-table__head" role="row">
                  <span role="columnheader">Expense</span>
                  <span role="columnheader">Paid by</span>
                  <span role="columnheader">Shared with</span>
                  <span role="columnheader">Original / EUR calculation</span>
                </div>
                {splitFx.expenses.map((expense) => {
                  const payer = participantMap[expense.paidBy];
                  return (
                    <div className="expense-table__row" role="row" key={expense.id}>
                      <span className="expense-name" role="cell">
                        <i>{categorySymbol[expense.category]}</i>
                        <span>
                          <strong>{expense.description}</strong>
                          <small>{expense.category}</small>
                        </span>
                      </span>
                      <span role="cell">
                        {payer ? (
                          <>
                            <Avatar participant={payer} size="small" />
                            <strong>{payer.name}</strong>
                          </>
                        ) : (
                          'Unknown'
                        )}
                      </span>
                      <span role="cell">
                        <AvatarStack
                          participants={splitFx.participants.filter(({ id }) =>
                            expense.sharedBy.includes(id),
                          )}
                        />
                      </span>
                      <span className="expense-amount" role="cell">
                        <strong>{formatMoney(expense.amount)}</strong>
                        <small>
                          {expense.amount.currency === splitFx.baseCurrency
                            ? 'Base currency'
                            : `${formatMoney(
                                convertMoney(expense.amount, splitFx.baseCurrency, splitFx.rates),
                              )} after demo FX`}
                        </small>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>

      {isAddingExpense ? (
        <AddExpenseDialog
          participants={splitFx.participants}
          onClose={() => setIsAddingExpense(false)}
          onSubmit={submitExpense}
        />
      ) : null}
    </div>
  );
}
