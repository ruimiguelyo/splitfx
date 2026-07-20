export const currencies = ['EUR', 'GBP', 'USD'] as const;

export type Currency = (typeof currencies)[number];

export interface Money {
  readonly minor: number;
  readonly currency: Currency;
}

export type FxRates = Readonly<Record<Currency, number>>;

const FRACTION_DIGITS: Record<Currency, number> = {
  EUR: 2,
  GBP: 2,
  USD: 2,
};

export function money(minor: number, currency: Currency): Money {
  if (!Number.isSafeInteger(minor)) {
    throw new TypeError('Money must be represented as a safe integer in minor units.');
  }

  return { minor, currency };
}

export function fromMajor(major: number, currency: Currency): Money {
  if (!Number.isFinite(major)) {
    throw new TypeError('Money input must be a finite number.');
  }

  return money(Math.round(major * 10 ** FRACTION_DIGITS[currency]), currency);
}

export function toMajor(value: Money): number {
  return value.minor / 10 ** FRACTION_DIGITS[value.currency];
}

/**
 * Rates are expressed as units of each currency for one EUR.
 * Conversion is rounded exactly once, at the target currency boundary.
 */
export function convertMoney(value: Money, target: Currency, rates: FxRates): Money {
  if (value.currency === target) {
    return money(value.minor, target);
  }

  const valueInEur = toMajor(value) / rates[value.currency];
  return fromMajor(valueInEur * rates[target], target);
}

export function formatMoney(value: Money, locale = 'en-GB'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency,
    minimumFractionDigits: FRACTION_DIGITS[value.currency],
  }).format(toMajor(value));
}

export function formatSignedMoney(value: Money, locale = 'en-GB'): string {
  const absolute = money(Math.abs(value.minor), value.currency);
  const prefix = value.minor > 0 ? '+' : value.minor < 0 ? '−' : '';
  return `${prefix}${formatMoney(absolute, locale)}`;
}
