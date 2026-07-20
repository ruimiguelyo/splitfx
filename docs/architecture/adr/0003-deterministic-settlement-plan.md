# ADR 0003: Use deterministic greedy settlement matching

- **Status:** Accepted for the prototype
- **Date:** 2026-07-20

## Context

After converting and allocating expenses, some participants have positive balances and others have negative balances. The interface needs a small, understandable set of suggested transfers that resolves those positions.

“Optimal” is ambiguous: it could mean fewest transfers, lowest fees, preferred relationships, transfer limits, currency availability, or another objective. The prototype has no evidence for those constraints and should not imply a proof it does not provide.

## Decision

Construct a deterministic compact plan:

1. Separate positive balances into creditors and negative balances into debtors.
2. Sort each by largest remaining absolute position, using participant ID as a stable tie-breaker.
3. Match the current largest debtor and creditor.
4. Transfer the smaller remaining amount.
5. Advance each side as its position reaches zero.
6. Continue until there are no remaining matched positions.

Describe the output as a settlement suggestion using **fewer transfers**, never as a globally minimal plan.

Before settlement, each converted expense is split equally across its selected participants. Participant IDs are sorted, base shares are calculated in minor units, and indivisible remainder units are assigned deterministically so allocated shares equal the converted expense total.

## Consequences

### Positive

- The same balances always produce the same ordered suggestions.
- The routine is compact, easy to inspect, and straightforward to test.
- Every transfer is bounded by current debtor and creditor positions.
- Minor-unit conservation is maintained.

### Negative

- The result is not proven to minimise transfers globally.
- It does not model fees, limits, preferred recipients, multiple settlement currencies, or payment availability.
- Participant IDs influence tie ordering; a product policy might choose a different visible rule.
- Invalid ledgers whose balances do not sum to zero require separate validation rather than being repaired by the matcher.

## Alternatives considered

### Pairwise reimbursement of every expense

Rejected because it produces unnecessary transfers and ties settlement presentation to expense order.

### Claim or solve a global minimum-transfer problem

Rejected for this scope because the optimisation objective and production constraints are undefined. A more complex search would add cost without a validated user requirement.

### Let the UI construct transfer rows

Rejected because calculation rules belong in a pure domain module, independently testable from rendering.

## Verification

Tests should cover no-op settled input, one debtor/creditor, multiple positions, stable tie-breaking, correct direction, correct currency, no transfer exceeding remaining positions, and total transferred amounts resolving the ledger.
