# ADR 0001: Represent money in integer minor units

- **Status:** Accepted for the prototype
- **Date:** 2026-07-20

## Context

SplitFX adds, converts, divides, formats, and compares monetary values. JavaScript's `number` type uses binary floating-point representation, so ordinary decimal arithmetic can produce results that are surprising in a financial interface. Currency must also remain attached to every amount so that values are not accidentally combined without conversion.

The prototype supports EUR, GBP, and USD. Each is modelled with two fraction digits.

## Decision

Represent domain money as:

```ts
interface Money {
  readonly minor: number;
  readonly currency: 'EUR' | 'GBP' | 'USD';
}
```

`minor` must be a safe integer. User-facing major-unit input crosses into the domain through a constructor that multiplies by the supported currency's fraction scale and rounds to the nearest minor unit.

Rates are documented as units of each currency for one EUR. For a cross-currency conversion:

1. Convert the source minor units to source major units.
2. Divide by the source rate to normalise through EUR.
3. Multiply by the target rate.
4. Round once when constructing the target minor-unit amount.

If source and target currencies match, return the same minor-unit value with the target currency.

## Consequences

### Positive

- Addition, subtraction, comparison, balance aggregation, and allocation remain integral.
- Every amount carries its currency in the type.
- Rounding occurs at a named boundary and can be tested directly.
- Expense-share remainders can be allocated without losing or creating a minor unit.

### Negative

- Rate arithmetic still uses JavaScript numbers; this is appropriate for a demo but not a universal precision model.
- The current fraction-digit table is intentionally limited to three two-decimal currencies.
- Very large values must remain within JavaScript's safe integer range.
- The single rounding policy may differ from a future provider's executable quote contract.

## Alternatives considered

### Store major units as `number`

Rejected because ordinary arithmetic would spread floating-point concerns across the domain and UI.

### Store formatted currency strings

Rejected because formatting is a presentation output, not a safe calculation representation.

### Introduce a decimal or money library

Deferred. A production-grade integration may justify an audited decimal/money library, provider-specific rounding, and authoritative currency metadata. The prototype's limited domain can keep its rules visible with no new dependency.

## Verification

Domain tests should cover safe-integer validation, non-finite major input, same- and cross-currency conversion, rate direction, boundary rounding, signed formatting, and total conservation after allocation.
