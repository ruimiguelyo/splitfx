import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore } from '../app/store';
import { SplitFxLab } from './SplitFxLab';

function renderLab() {
  const store = createAppStore();
  const onBack = jest.fn();
  const result = render(
    <Provider store={store}>
      <SplitFxLab onBack={onBack} />
    </Provider>,
  );

  return { ...result, onBack, store };
}

describe('SplitFxLab', () => {
  it('moves between overview and ledger, adds an expense, and restores demo data', () => {
    const { onBack, store } = renderLab();
    const originalCount = store.getState().splitFx.expenses.length;

    expect(screen.getByRole('heading', { name: /make the split obvious/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /settlement plan/i })).toBeInTheDocument();

    const explanationButton = screen.getAllByRole('button', { name: /explain why/i })[0];
    expect(explanationButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(explanationButton!);
    expect(explanationButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/negative net position.*does not initiate a transfer/i)).toBeVisible();
    fireEvent.click(explanationButton!);
    expect(explanationButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/does not initiate a transfer/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^expenses/i }));
    expect(screen.getByRole('heading', { name: /one source of truth/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /group expenses/i })).toBeInTheDocument();
    expect(screen.getAllByText('Base currency')).not.toHaveLength(0);
    expect(screen.getAllByText(/after demo FX/i)).not.toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: /add another/i }));
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'City taxi' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '38.40' } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText(/paid by/i), { target: { value: 'sam' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'other' } });
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: /^add expense$/i }),
    );

    expect(screen.getByText('City taxi')).toBeInTheDocument();
    expect(store.getState().splitFx.expenses).toHaveLength(originalCount + 1);
    expect(store.getState().splitFx.expenses[0]).toMatchObject({
      description: 'City taxi',
      amount: { minor: 3840, currency: 'USD' },
      paidBy: 'sam',
      category: 'other',
    });

    fireEvent.click(screen.getByRole('button', { name: /^reset$/i }));
    expect(screen.queryByText('City taxi')).not.toBeInTheDocument();
    expect(store.getState().splitFx.expenses).toHaveLength(originalCount);

    fireEvent.click(screen.getByRole('button', { name: /^overview/i }));
    expect(screen.getByRole('heading', { name: /settlement plan/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /portfolio/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('lets a user cancel the header add-expense flow', () => {
    renderLab();

    fireEvent.click(screen.getByRole('button', { name: /^add expense$/i }));
    expect(screen.getByRole('dialog', { name: /what did you pay for/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(screen.queryByRole('dialog', { name: /what did you pay for/i })).not.toBeInTheDocument();
  });

  it('shows live, expired, loading, offline, failed, and recovered quote states', async () => {
    const { store } = renderLab();

    expect(screen.getByText('Demo rate current')).toBeInTheDocument();
    expect(screen.getByText(/expires in/i)).toHaveTextContent(/\d{2}:\d{2}/);

    fireEvent.click(screen.getByRole('button', { name: /expire rate/i }));
    expect(screen.getByText('Quote expired')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /refresh quote/i }));
    expect(screen.getByText('Refreshing quote')).toBeInTheDocument();
    expect(await screen.findByText('Demo rate current', {}, { timeout: 1500 })).toBeInTheDocument();
    expect(store.getState().splitFx.quoteRequest).toBe('idle');

    fireEvent.click(screen.getByRole('button', { name: /go offline/i }));
    expect(screen.getByText('You are offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /refresh quote/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/reconnect to refresh/i);
    expect(screen.getByText('You are offline')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /reconnect/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(screen.getByText('Refresh failed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /refresh quote/i }));
    expect(await screen.findByText('Demo rate current', {}, { timeout: 1500 })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /restore demo/i }));
    expect(screen.getByText('Demo rate current')).toBeInTheDocument();
  });
});
