# Recruiter walkthrough

This path is designed to make the portfolio understandable in five minutes and discussable in fifteen. It does not require prior knowledge of the codebase.

## Five-minute self-guided review

### 0:00–0:45 — Understand the problem

Read the opening of the [project README](../README.md). The central question is not simply how to split a bill; it is how to make multi-currency calculations, rounding, quote freshness, and settlement suggestions understandable.

Look for three honest boundaries immediately:

- The data and FX rates are fictional demo inputs.
- No money is moved.
- The settlement plan is deterministic and compact, not claimed to be globally minimal.

### 0:45–2:15 — Use the product

With the app running locally:

1. Scan the group total, quote status, balances, and expenses.
2. Add a valid expense, choosing a payer and the participants sharing it.
3. Observe that the expense list, balances, and suggested transfers update from one action.
4. Trigger an expired or offline quote state and inspect the recovery guidance.
5. Reset the demo.

The point is not the number of screens. It is whether the interface explains consequential state and remains coherent outside the happy path.

### 2:15–3:30 — Inspect the financial rules

Open:

- [`src/domain/money.ts`](../src/domain/money.ts) for minor-unit representation, conversion direction, and target-boundary rounding.
- [`src/domain/settlements.ts`](../src/domain/settlements.ts) for deterministic share allocation, balances, and debtor/creditor matching.
- [`src/domain/money.test.ts`](../src/domain/money.test.ts) and [`src/domain/settlements.test.ts`](../src/domain/settlements.test.ts) for executable examples.

The useful review question is: “Could another engineer reproduce and challenge these rules without reverse-engineering the UI?”

### 3:30–4:15 — Inspect state design

Open:

- [`src/features/splitfx/splitFxSlice.ts`](../src/features/splitfx/splitFxSlice.ts) for source data and quote lifecycle.
- [`src/features/splitfx/selectors.ts`](../src/features/splitfx/selectors.ts) for derived totals, balances, and settlements.

The store does not persist calculated balances as another source of truth. Typed selectors derive them from participants, expenses, base currency, and rates.

### 4:15–5:00 — Inspect engineering judgement

Read the short [architecture decision index](architecture/README.md) and [testing/accessibility strategy](TESTING_AND_ACCESSIBILITY.md). They document why the implementation is shaped this way, its trade-offs, and what would have to change before production.

## Fifteen-minute interview demo

### Opening: 45 seconds

```text
SplitFX is a frontend prototype for a group that has shared expenses in different currencies. I chose it because the hard part is not drawing the cards; it is making the calculation and the state trustworthy. The project keeps money in minor units, makes quote freshness explicit, derives balances from source state, and documents where the prototype stops.
```

### Product tour: 4 minutes

1. Establish that all content is demo data.
2. Point out the quote state before the headline total.
3. Add an expense and explain that one state transition drives several derived views.
4. Demonstrate an expired/offline path, not only the happy path.
5. Read one settlement suggestion aloud to confirm direction and currency are clear.

### Code tour: 5 minutes

1. Show the `Money` type and why `minor` is an integer.
2. Show the documented rate convention: units of each currency per one EUR.
3. Show deterministic remainder allocation after conversion.
4. Show the greedy settlement routine and its deliberately limited claim.
5. Show Redux source state versus memoized derived selectors.

### Quality and accessibility: 3 minutes

1. Run or show the output of `npm run verify` only if it actually passed.
2. Explain which rules have domain tests and which journey Cypress covers.
3. Demonstrate keyboard navigation and visible focus.
4. Explain that automated checks are not an accessibility certification.

### Close: 2 minutes

```text
If I took this beyond a prototype, I would first validate whether people understand the calculation and quote state. Technically, I would introduce authenticated persistence and a quote-provider adapter with explicit fees, attribution, and expiry. Payments would be a separate, security- and compliance-heavy capability rather than an extra button on this interface.
```

## Likely engineering questions

### Why not store decimal amounts?

Binary floating-point arithmetic can make base-10 financial totals surprising. SplitFX converts supported major-unit inputs to safe integer minor units at the boundary and keeps subsequent allocation integral. A production model would also use authoritative currency exponent metadata and potentially decimal/rational representations for rate arithmetic.

### Where does rounding happen?

Rates are expressed as units of a currency per one EUR. A cross-currency amount is normalised through EUR and rounded once when constructing the target-currency minor-unit amount. Equal splitting then distributes any indivisible minor-unit remainder deterministically.

### Is the settlement plan optimal?

No global-minimum claim is made. It greedily matches the largest debtor and creditor, producing a deterministic, compact plan. A different optimisation objective or proof requirement would need a different algorithm and tests.

### Why Redux for a small prototype?

The feature has several views driven by the same expenses, participants, rates, and asynchronous quote lifecycle. Redux Toolkit makes transitions explicit and selectors keep derived financial data out of stored state. For a smaller isolated widget, component state could be sufficient.

### Is the FX quote real?

No. Refresh latency and quote lifecycle are simulated over fixed demo rates. That lets the prototype explore frontend states without pretending to provide market data. A production adapter would need provider contracts, fees/spread semantics, attribution, expiry, retry, observability, and tests at the network boundary.

### What would productionisation require?

At minimum: authenticated and authorised APIs, persistence, auditability, privacy and retention decisions, authoritative currency metadata, a real quote contract, security review, localisation, observability, broader testing, accessibility research, and a separately designed payment/compliance flow.

### What is the most important accessibility decision?

Consequential meaning cannot depend on colour. Signed amounts, labels, semantic status, programmatic form errors, keyboard focus management, and live-region restraint all matter. The manual test plan is documented because linting alone cannot validate the experience.

### What would you measure next?

First validate comprehension: whether a reviewer can explain a balance, notices an expired quote, and completes the add-expense flow without instruction. Those are proposed validation signals, not existing product metrics.

## Claims to avoid

Do not say that SplitFX:

- Uses live or accurate market FX rates.
- Connects to Revolut, a bank, or a payment provider.
- Has production users, measured conversion, adoption, revenue, or performance outcomes.
- Moves or safeguards money.
- Produces the mathematical minimum number of transfers.
- Is fully WCAG compliant, audited, secure, scalable, or production-ready.
- Was built with undocumented technologies during Rui's Deloitte employment.

Precision makes the portfolio stronger: the value is in the demonstrable decisions and implementation, not inflated scope.
