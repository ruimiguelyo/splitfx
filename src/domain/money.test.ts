import { convertMoney, formatMoney, formatSignedMoney, fromMajor, money, toMajor } from './money';

const rates = { EUR: 1, GBP: 0.8, USD: 1.1 } as const;

describe('money', () => {
  it('stores values in integer minor units', () => {
    expect(fromMajor(12.345, 'EUR')).toEqual({ minor: 1235, currency: 'EUR' });
    expect(toMajor(money(1235, 'EUR'))).toBe(12.35);
  });

  it('rejects unsafe minor-unit values', () => {
    expect(() => money(10.5, 'EUR')).toThrow(/safe integer/i);
    expect(() => money(Number.MAX_SAFE_INTEGER + 1, 'USD')).toThrow(/safe integer/i);
  });

  it('rejects non-finite major-unit input', () => {
    expect(() => fromMajor(Number.POSITIVE_INFINITY, 'GBP')).toThrow(/finite number/i);
    expect(() => fromMajor(Number.NaN, 'EUR')).toThrow(/finite number/i);
  });

  it('converts through the EUR base and rounds once', () => {
    expect(convertMoney(money(8000, 'GBP'), 'USD', rates)).toEqual({
      minor: 11000,
      currency: 'USD',
    });
  });

  it('keeps same-currency values in their exact minor units', () => {
    expect(convertMoney(money(-123, 'USD'), 'USD', rates)).toEqual({
      minor: -123,
      currency: 'USD',
    });
  });

  it('formats currency for a human-readable explanation', () => {
    expect(formatMoney(money(123456, 'EUR'), 'en-IE')).toContain('1,234.56');
  });

  it('makes positive, negative, and zero balance direction explicit', () => {
    const unsigned = formatMoney(money(125, 'EUR'), 'en-IE');
    const positive = formatSignedMoney(money(125, 'EUR'), 'en-IE');
    const negative = formatSignedMoney(money(-125, 'EUR'), 'en-IE');

    expect(positive).toBe(`+${unsigned}`);
    expect(negative.endsWith(unsigned)).toBe(true);
    expect(negative).toHaveLength(unsigned.length + 1);
    expect(formatSignedMoney(money(0, 'EUR'), 'en-IE')).toBe(formatMoney(money(0, 'EUR'), 'en-IE'));
  });
});
