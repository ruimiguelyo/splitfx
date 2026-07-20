import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { createAppStore } from './store';

describe('portfolio application', () => {
  beforeEach(() => {
    window.location.hash = '';
    jest.mocked(window.scrollTo).mockClear();
  });

  it('opens the product demo from the primary call to action', async () => {
    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /explore the live product/i }));
    expect(await screen.findByTestId('splitfx-lab')).toBeInTheDocument();
  });

  it('offers keyboard quick navigation', () => {
    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>,
    );
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /where do you want to go/i })).toBeInTheDocument();
  });

  it('supports the macOS shortcut and closes quick navigation explicitly', () => {
    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>,
    );

    fireEvent.keyDown(window, { key: 'x', metaKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'K', metaKey: true });
    expect(screen.getByRole('dialog', { name: /where do you want to go/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close quick navigation/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('loads a deep-linked product route and returns to the portfolio', async () => {
    window.location.hash = '#/splitfx';
    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>,
    );

    expect(await screen.findByTestId('splitfx-lab')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /portfolio/i }));

    expect(screen.getByRole('heading', { name: /complex logic/i })).toBeInTheDocument();
    expect(window.location.hash).toBe('#top');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('synchronises the route when the location hash changes', async () => {
    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>,
    );

    window.location.hash = '#/splitfx';
    fireEvent(window, new HashChangeEvent('hashchange'));

    expect(await screen.findByTestId('splitfx-lab')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});
