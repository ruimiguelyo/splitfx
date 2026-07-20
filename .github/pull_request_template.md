## Problem and outcome

<!-- What user or engineering problem does this address, and what becomes true? -->

## Changes

<!-- Keep this concrete and scoped. -->

-

## Evidence

<!-- Add before/after screenshots or a short recording for visible UI changes. Include useful alt text. Remove this section when not applicable. -->

## Verification

- [ ] `npm run format:check`
- [ ] `npm run verify`
- [ ] `npm run test:e2e`
- [ ] New or changed behaviour has a meaningful test at the lowest useful layer.

If a check was not run, explain why and what risk remains:

<!-- Verification notes -->

## Money and FX review

<!-- Complete when amounts, currency, rates, balances, or settlements change. Otherwise mark not applicable. -->

- [ ] Not applicable.
- [ ] Currency and rate direction remain explicit.
- [ ] Minor-unit conservation and rounding boundaries are covered by tests.
- [ ] Quote state and demo-rate wording do not imply live market data.
- [ ] Settlement language does not claim unproven optimality or payment execution.

## Accessibility review

- [ ] Keyboard order and visible focus were checked for affected interactions.
- [ ] Names, labels, headings, errors, and status announcements were checked.
- [ ] Meaning does not depend on colour, motion, hover, or placeholder text alone.
- [ ] Narrow viewport, 200% zoom, and reduced-motion behaviour were considered.

Manual environment and assistive technology used:

<!-- Browser, operating system, viewport, screen reader if tested -->

## Risk and boundaries

- [ ] No credential, personal financial data, client material, or confidential information is included.
- [ ] Demo data remains clearly fictional.
- [ ] Documentation and ADRs were updated when a contract or trade-off changed.
- [ ] The change does not imply users, metrics, integrations, or production readiness that are not evidenced.

Known risks or follow-up work:

<!-- Be explicit; “none” is acceptable when justified. -->
