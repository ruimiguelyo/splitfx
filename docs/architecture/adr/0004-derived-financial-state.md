# ADR 0004: Derive financial views from source state

- **Status:** Accepted for the prototype
- **Date:** 2026-07-20

## Context

One expense change affects the group total, each participant's balance, and the settlement suggestion. Storing every affected value would create multiple sources of truth and require reducers to keep them synchronised after every expense, rate, or base-currency change.

At the same time, the quote refresh has a genuine asynchronous lifecycle and several interface regions consume the same feature state.

## Decision

Use Redux Toolkit to store feature inputs and lifecycle state:

- Group name and base currency.
- Participants and expenses.
- Demo rates and quote timestamps.
- Network, request, and error state.

Use memoized selectors to derive:

- Trip total.
- Participant lookup.
- Per-participant balances.
- Settlement suggestions.
- Quote health.

Keep money and settlement calculation in pure domain functions that are independent of React and Redux.

## Consequences

### Positive

- Expense, total, balance, and settlement views cannot drift through missed update logic.
- Reducers express state transitions rather than financial algorithms.
- Domain tests run without rendering or constructing a store.
- Memoized selectors provide a stable boundary for shared derived data.
- Async quote behaviour remains observable and testable.

### Negative

- Redux adds concepts and code that a single isolated form would not need.
- Derived calculations run when their selector inputs change.
- Selector consumers must use the canonical functions rather than recreating logic in components.
- The client store is ephemeral; it is not a persistence or multi-user model.

## Alternatives considered

### Component-local state only

Deferred for simpler widgets. Here, several sibling regions consume the same ledger and quote lifecycle, so a central typed feature boundary improves reviewability.

### Store balances and settlements in reducers

Rejected because they are functions of existing state and would create synchronisation risk.

### Put all calculations in selectors

Rejected because selectors are application adapters. The underlying rules should remain reusable pure domain functions with direct tests.

## Verification

Reducer tests should cover source-state transitions. Selector tests should show recalculation after relevant input changes and stability for unchanged inputs. Domain tests should own the detailed arithmetic examples.
