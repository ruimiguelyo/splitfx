# Testing and accessibility strategy

## Quality goal

SplitFX should make its most consequential behaviour easy to challenge: money representation, conversion, split conservation, settlement direction, quote state, form validation, and keyboard interaction.

The strategy favours a small number of meaningful behavioural assertions over snapshots of implementation details. Automated checks are a baseline, not evidence that the prototype is production-ready or fully accessible.

## Local quality gates

| Command                 | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run lint`          | TypeScript, React Hooks, and JSX accessibility lint rules         |
| `npm run typecheck`     | Strict TypeScript validation without emitting files               |
| `npm run test`          | Jest unit and component suite                                     |
| `npm run test:coverage` | Jest suite with configured global coverage thresholds             |
| `npm run build`         | Production Webpack build                                          |
| `npm run test:e2e`      | Cypress critical-path browser test against the development server |
| `npm run format:check`  | Prettier conformance check                                        |
| `npm run verify`        | Formatting, lint, types, coverage-enforced tests, and build       |

The Jest configuration currently requires at least 75% branch coverage and 80% function, line, and statement coverage globally. Thresholds are guardrails: a passing percentage does not show that the right behaviours were tested.

## Test layers

### Domain unit tests

Pure tests are the primary defence for calculations. They should cover:

- Rejecting non-finite or non-safe money inputs.
- Major-to-minor conversion at the supported currency boundary.
- Same-currency conversion as an identity operation.
- Cross-currency rate direction and rounding.
- Conservation of each expense after equal splitting.
- Deterministic allocation of indivisible minor-unit remainders.
- Reordered participant input producing stable results.
- Unknown payer and participant failures.
- Positive and negative balances resolving to zero overall.
- Settlement direction, amount, currency, determinism, and already-settled input.

### State tests

Redux tests should treat reducers and async lifecycle behaviour as public contracts:

- Known initial demo state.
- Adding and removing an expense.
- Resetting to a fresh initial state.
- Explicit live, loading, expired, offline, and error quote transitions.
- Offline refresh rejection and recovery.
- Selectors recalculating from source data without mutating it.

### Component integration tests

Testing Library tests should interact through roles, labels, names, and visible copy:

- The primary page landmarks and headings are discoverable.
- The add-expense form opens, validates, and can be cancelled.
- A valid expense updates the visible list and balances.
- Errors are associated with their fields and announced appropriately.
- Quote status and refresh feedback are readable without inspecting class names.
- Dialog focus enters, remains usable, and returns to the trigger when closed.
- Destructive actions have an unambiguous accessible name.

### End-to-end test

The Cypress journey should stay deliberately short and high-value:

1. Load the known demo group.
2. Open the add-expense experience.
3. Enter a valid expense and submit it.
4. Confirm the expense and derived result appear.
5. Exercise a quote-state recovery path.
6. Reset to the known demo state.

The browser test checks integration, not every permutation already covered by fast domain tests.

## Change validation loop

For changes to financial behaviour:

1. Write or refine an acceptance example in plain language.
2. Add the smallest failing domain or selector test.
3. Implement the rule with pure functions where possible.
4. Add a component test for user-observable behaviour.
5. Add or change the Cypress journey only when the cross-layer flow changes materially.
6. Run `npm run verify` and the relevant end-to-end test before merging.

For visual-only changes, begin with the semantic structure and keyboard behaviour, then verify the responsive presentation.

## Accessibility baseline

The target is a strong WCAG 2.2 AA-oriented prototype baseline, not a certification claim.

### Structure and semantics

- One descriptive `h1`, followed by a logical heading hierarchy.
- Native buttons, inputs, fieldsets, legends, lists, and dialog semantics where applicable.
- Landmarks that let assistive-technology users move between primary content and supporting profile content.
- Table semantics only for genuinely tabular data.

### Keyboard and focus

- Every interactive control is reachable and operable without a pointer.
- Focus order follows the visual and reading order.
- Focus is always visible.
- Opening a modal moves focus into it; closing returns focus to the invoking control.
- Escape closes a modal when doing so cannot lose submitted work.
- No hover-only information or interaction.

### Forms and errors

- Every input has a persistent programmatic label.
- Related participant choices use `fieldset` and `legend` semantics.
- Instructions are available before input, not only after failure.
- Error text identifies the problem and recovery, is linked to its field, and is announced.
- Disabled or loading controls retain an understandable status.

### Status and data visualisation

- Live regions are used sparingly for asynchronous quote results and form outcomes.
- Signed values and words carry balance meaning; colour is supplementary.
- Currency codes or symbols remain unambiguous in context.
- Motion respects `prefers-reduced-motion`.
- Information remains available at narrow widths and at 200% zoom without two-dimensional scrolling for ordinary content.

### Visual baseline

- Text and essential controls should meet WCAG AA contrast.
- Touch targets should be comfortably operable, with spacing that reduces accidental activation.
- Focus indicators must contrast against adjacent colours.
- Placeholder text is never the only label or instruction.

## Manual review checklist

Run this before publishing and after significant UI changes:

- [ ] Complete the primary journey using only `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape`.
- [ ] Confirm focus enters and exits the add-expense surface predictably.
- [ ] Confirm every control has a useful name in browser accessibility tools.
- [ ] Test at 200% browser zoom at 1280 CSS pixels.
- [ ] Test a narrow 320 CSS-pixel viewport without clipped actions or hidden content.
- [ ] Enable reduced motion and confirm no essential information depends on animation.
- [ ] Inspect normal, hover, focus, disabled, error, offline, expired, and loading contrast.
- [ ] Check the page with a screen reader, including headings, form errors, quote refresh, and balance changes.
- [ ] Check Windows High Contrast or forced-colours mode.
- [ ] Confirm currency and positive/negative balance meaning remains clear without colour.

Record the browser, operating system, assistive technology, date, failures, and retest outcome in the pull request. Do not turn an unperformed checklist into a claim.

## CI policy

Pull requests and pushes to `main` run formatting, linting, type checking, coverage-enforced tests, a production build, and the Cypress journey. GitHub Pages deployment rebuilds from `main` and proceeds only if its verification step succeeds.

Before treating the badges or hosted demo as evidence, confirm the actual GitHub Actions run is green. A workflow file in the repository is configuration, not proof that it has passed.

## Known gaps

- No completed audit by an accessibility specialist is claimed.
- No production browser/device support matrix is claimed.
- No performance budget is enforced in CI beyond Webpack's configured asset warnings.
- Demo-state tests do not validate a real FX service, payment system, persistence layer, or security boundary.
