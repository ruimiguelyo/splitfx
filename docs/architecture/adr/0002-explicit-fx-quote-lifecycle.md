# ADR 0002: Model the FX quote lifecycle explicitly

- **Status:** Accepted for the prototype
- **Date:** 2026-07-20

## Context

A converted amount can look current even when its underlying quote is loading, stale, unavailable, or failed. Hiding those conditions would teach the wrong product behaviour, especially in a portfolio project centred on financial clarity.

SplitFX has no live FX provider. It still needs enough lifecycle state to design and test the interface honestly.

## Decision

Store the independent inputs to quote health:

- Network simulation: `online` or `offline`.
- Request state: `idle`, `loading`, or `failed`.
- Error message when a refresh is rejected.
- Quote update and validity timestamps.
- Fixed demo rates bundled with the application.

Derive one user-facing quote health value with this precedence:

1. `offline`
2. `loading`
3. `error`
4. `expired`
5. `live`

A refresh uses a short simulated delay and returns the same demo rates with fresh timestamps. An offline refresh is rejected with recovery copy. No network call or market-data claim is made.

## Consequences

### Positive

- Non-happy-path behaviour can be reviewed without an unreliable external dependency.
- The interface cannot silently label every bundled rate as current.
- State transitions are testable through reducer/thunk and selector contracts.
- A future adapter has an obvious lifecycle surface to satisfy.

### Negative

- The word “live” refers only to the simulated quote's local validity state, not live market pricing.
- Fixed rates cannot validate provider latency, partial payloads, rate drift, throttling, or server-clock behaviour.
- Orthogonal state fields can represent combinations the selector must resolve through precedence.

## Alternatives considered

### Show the fixed rates with no status

Rejected because it visually overstates their authority and avoids the main product problem.

### Call a free public FX endpoint

Rejected for this prototype. It would add availability, terms, key management, caching, privacy, and attribution concerns without creating a production quote contract.

### Store only a status enum

Rejected because network availability, request progress, failure, and timestamp expiry are independent facts. Keeping the facts allows the UI health model to be derived and tested.

## Production revisit

A real adapter would need a documented rate direction, provider attribution, fees and spread semantics, executable-versus-indicative status, quote identifier, expiry authority, clock handling, retry policy, observability, and security review.

## Verification

Tests should cover initial live state, expiry at the validity boundary, offline precedence, loading precedence, rejection copy, successful refresh timestamps, and reconnect behaviour before and after expiry.
