# SplitFX

**A small side project for splitting group expenses when people pay in different currencies.**

![SplitFX preview](public/social-card.svg)

[Try the live demo](https://ruimiguelyo.github.io/splitfx/) · [View the code](https://github.com/ruimiguelyo/splitfx) · [CI status](https://github.com/ruimiguelyo/splitfx/actions/workflows/ci.yml)

I started SplitFX because splitting a dinner or a weekend trip is easy until people pay in EUR, GBP, and USD at the same time. At that point, rounding, exchange rates, and stale quotes can make a simple result difficult to trust.

I wanted to build a small app where those details are visible instead of hidden. The project gave me a practical way to work on money calculations, derived state, testing, accessibility, and the awkward states that usually get ignored in a quick demo.

SplitFX is a personal side project. It is not connected to my professional SAP work, and it is not a real financial product. It uses fictional people, fictional expenses, and fixed demo exchange rates.

## What it does

- Starts with a fictional group trip and expenses in EUR, GBP, and USD.
- Lets you add an expense, choose who paid, and select who took part.
- Converts everything to the group's EUR base currency.
- Recalculates each person's balance after every change.
- Suggests a short, deterministic list of repayments.
- Shows loading, fresh, expired, offline, and error states for the demo FX quote.
- Resets the app back to the original demo data.

The quickest way to understand it is to [open the demo](https://ruimiguelyo.github.io/splitfx/), add an expense, and then switch between the quote states.

## Running it locally

You need Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:3000`.

To run the main checks:

```bash
npm run verify
npm run test:e2e
```

`npm run verify` checks formatting, linting, TypeScript, test coverage, and the production build. The Cypress end-to-end tests run separately because they start the app in a browser.

## A few choices I made

### Store money as minor units

I avoid using floating-point numbers for money. For example, EUR 12.34 is stored as `1234` cents:

```ts
interface Money {
  readonly minor: number;
  readonly currency: 'EUR' | 'GBP' | 'USD';
}
```

An expense is converted to EUR before it is divided. If the amount cannot be split evenly, the remaining cent is assigned in a consistent order. That way, the individual shares always add back to the original converted total.

### Calculate balances instead of storing them twice

Redux stores the participants, expenses, and quote state. Balances and repayment suggestions are calculated from that source data with selectors and pure domain functions.

I chose this because storing both the inputs and the calculated result makes it too easy for them to disagree after an update.

### Make the fake FX quote honest

There is no live exchange-rate provider. The refresh button is a controlled simulation using fixed demo rates.

I still modelled loading, expiry, offline, and error states because those are the situations a real integration would have to handle. The interface always shows whether the quote is usable instead of quietly continuing with stale data.

### Keep the settlement result predictable

The repayment algorithm is greedy and deterministic. It tries to reduce the number of transfers, but I do not claim that it always finds the mathematical minimum.

That trade-off felt more useful for this project than hiding a complicated optimisation behind a result that is difficult to explain.

## Testing

I added tests around the parts where a small mistake would be easy to miss:

- Money conversion, division, and rounding.
- Balance and settlement calculations.
- Redux state transitions and selectors.
- Adding an expense through the interface.
- Dialog focus and keyboard behaviour.
- The main browser journey with Cypress.

The project uses Jest, Testing Library, Cypress, strict TypeScript, ESLint, and GitHub Actions. More detail is available in [Testing and accessibility](docs/TESTING_AND_ACCESSIBILITY.md).

## Tech stack

- React and TypeScript
- Redux Toolkit and React Redux
- Webpack
- Jest and Testing Library
- Cypress
- CSS
- GitHub Actions and GitHub Pages

## Project structure

```text
src/
├── app/                 Store and typed Redux hooks
├── components/          Interface components
├── content/             Text used by the surrounding portfolio page
├── domain/              Money conversion and settlement rules
├── features/splitfx/    SplitFX state, selectors, demo data, and UI
└── test/                Shared test setup
cypress/                 End-to-end browser tests
docs/                    Product, architecture, and testing notes
.github/                 CI and GitHub Pages workflows
```

## What it does not do

- It does not connect to a bank or move money.
- It does not fetch live exchange rates.
- It has no backend, accounts, authentication, or persistence.
- It only supports EUR, GBP, and USD, with two decimal places.
- Its settlement algorithm is not guaranteed to find the global minimum number of transfers.
- Automated accessibility checks do not replace testing with real assistive technology.

These limits are intentional. I preferred a smaller project whose calculations and assumptions I could explain clearly.

## Extra notes

- [Product brief](docs/PRODUCT_BRIEF.md)
- [Architecture decisions](docs/architecture/README.md)
- [Testing and accessibility](docs/TESTING_AND_ACCESSIBILITY.md)
- [Short project walkthrough](docs/RECRUITER_WALKTHROUGH.md)

## About me

I'm Rui, a Computer Engineering student based in Setúbal, Portugal. My professional background is in SAP, ABAP development, and SAP functional analysis. Outside that work, I enjoy building side projects and learning more about AI engineering, data, and automation.

SplitFX is one of those side projects. I built it to practise working through a problem from the calculation rules to the final interface, and to get better at explaining the decisions behind the code.

- [My GitHub profile](https://github.com/ruimiguelyo)
- [LinkedIn](https://www.linkedin.com/in/rui-s%C3%A1-1243162ab/)

## Licence

This project is available under the [MIT License](LICENSE).
