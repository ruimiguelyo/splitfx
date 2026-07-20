# SplitFX product brief

## Summary

SplitFX is a client-side prototype for understanding and settling group expenses paid in multiple currencies. Its purpose is to demonstrate how a frontend can make financial calculations and quote state legible, rather than presenting a polished number with hidden assumptions.

All people, expenses, rates, and activity shown by the prototype are demo data. SplitFX does not connect to any financial institution or process payments.

## Problem

Cross-currency group spending creates three related sources of uncertainty:

1. **Input uncertainty:** people pay different amounts, in different currencies, for different subsets of a group.
2. **Calculation uncertainty:** conversion, division, and rounding can make a result hard to reproduce.
3. **Action uncertainty:** a user needs to know whether a displayed quote is current before acting on a settlement suggestion.

A useful interface must answer more than “what is the total?” It should also make the source expenses, quote condition, individual position, and proposed transfers understandable.

## Intended user and job

The intended user is a member of a small group that has shared costs across currencies and wants to understand the group's position before settling.

> When our group has paid for shared expenses in different currencies, I want to see how each person's position was calculated and a clear set of suggested transfers, so that we can settle with confidence.

This is a product hypothesis for the prototype, not a claim based on completed user research.

## Product principles

### Show the status, not just the value

A converted amount without quote context can look more authoritative than it is. The interface distinguishes live, loading, expired, offline, and error states.

### Make calculations reproducible

The model uses integer minor units, documented rate direction, a single conversion-rounding boundary, and deterministic remainder allocation.

### Keep source and derived data separate

Participants, expenses, rates, and quote lifecycle belong in application state. Totals, balances, and settlement suggestions are calculated from them.

### Describe optimisation honestly

The settlement routine matches the largest debtors and creditors to produce a compact plan. The product calls this “fewer transfers”; it does not promise a mathematically global minimum.

### Design every state

Loading, empty, validation, expired, offline, failure, and success states are product behaviour, not implementation afterthoughts.

## Prototype scope

### Included

- A fictional four-person group with demo expenses.
- Expenses in EUR, GBP, and USD.
- An EUR base currency.
- Equal splitting across the selected participants for each expense.
- Adding an expense through the interface.
- Derived per-person balances.
- A deterministic settlement suggestion.
- A simulated FX quote with a visible validity window.
- Controls for demonstrating non-happy-path quote states.
- Resetting the prototype to its initial demo state.

### Explicitly excluded

- Real FX data or a claim that demo rates reflect the market.
- Bank connections, transfers, cards, wallets, or any movement of money.
- Accounts, authentication, authorisation, identity verification, or fraud controls.
- Server persistence, multi-device synchronisation, invitations, and notifications.
- Fees, spreads, rate guarantees, legal terms, or regulated financial advice.
- Unequal, percentage-based, itemised, or recurring splits.
- Production localisation and currencies with other fraction-digit rules.

## Core journey and acceptance criteria

### 1. Understand the starting position

- The user can identify the group, total, people, expenses, and base currency.
- Each amount carries an explicit currency.
- The quote status is visible and is not described as live market data.

### 2. Add an expense

- Description and amount are validated before submission.
- A payer is required.
- At least one participant must share the expense.
- A successful submission closes or clears the form and updates derived output.
- The entered major-unit amount is converted to an integer minor-unit value at the domain boundary.

### 3. Review balances

- Each participant's balance is derived from all current expenses.
- Positive, negative, and settled positions are distinguishable by text, not colour alone.
- The balances sum to zero in the base currency after deterministic remainder allocation.

### 4. Review settlement suggestions

- Each suggestion names a sender, recipient, currency, and amount.
- Suggestions are stable for the same input data.
- The language avoids claiming global optimality.

### 5. Encounter quote risk

- Loading prevents ambiguous repeated refresh behaviour.
- Expired and offline states explain why the quote should not be treated as refreshed.
- Failure includes a clear recovery path.

## Trust model

| Surface              | What the prototype guarantees                                             | What it does not guarantee                            |
| -------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| Money representation | Safe integer minor units for supported demo currencies                    | Arbitrary currency exponent support                   |
| Conversion           | Documented EUR-based rate direction and one target-boundary rounding step | Market accuracy, fees, or executable pricing          |
| Expense split        | Shares conserve the converted minor-unit total                            | A user-selected remainder policy                      |
| Settlement           | Deterministic debtor/creditor matching                                    | A globally minimum number of transfers                |
| Quote status         | Explicit simulated lifecycle and timestamps                               | Connectivity to an FX provider                        |
| Data                 | Predictable local demo state                                              | Persistence, privacy controls, or production security |

## Success signals for future validation

These are proposed research signals, not achieved metrics:

- A reviewer can explain why a participant owes or receives a given amount.
- A reviewer notices when a quote is expired or offline before attempting to refresh it.
- A reviewer can add a valid expense without instruction.
- Keyboard-only use can complete the primary journey with a visible focus position.
- Screen-reader output communicates form errors and status changes at the right time.
- The calculation rules remain stable under reordered participants and expenses.

## Risks and mitigations

| Risk                                           | Prototype mitigation                                        | Production follow-up                                                         |
| ---------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Demo quote appears real                        | Label it as simulated and expose state                      | Integrate a documented provider and pricing terms                            |
| Rounding looks arbitrary                       | Minor units, one rounding boundary, deterministic remainder | Explain policy in product copy and support currency exponents                |
| Colour carries meaning alone                   | Pair visual treatment with signed values and labels         | Manual assistive-technology research                                         |
| A suggested transfer is mistaken for execution | Use suggestion language and no payment action               | Add confirmation, recipient verification, audit trail, and compliance review |
| Local state is mistaken for saved data         | State the reset behaviour and prototype boundary            | Authenticated backend with privacy and retention controls                    |

## Possible next increments

Priorities would be validated before implementation.

1. Add an explain-calculation view for a selected balance.
2. Add unequal and itemised split rules with explicit remainder ownership.
3. Persist groups behind authenticated, authorised APIs.
4. Introduce a real quote adapter with fees, rate direction, expiry, and provider attribution.
5. Add invitation and settlement-confirmation states without implying transfer execution.
6. Expand localisation and currency metadata.
7. Validate the experience through keyboard, screen-reader, and user research sessions.

## Product review questions

- Does the interface make a simulated quote unmistakable?
- Can someone trace a settlement amount back to its expenses?
- Is the expired/offline recovery action clear?
- Which split rules would users expect before trusting this for a real trip?
- Where would confirmation and recipient verification be required if payments were added?
- What should persist, for how long, and for whom?
