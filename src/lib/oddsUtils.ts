/**
 * Utility functions for odds conversion and calculation
 */

export type OddsFormat = 'decimal' | 'fractional' | 'american' | 'implied';

export interface OddsState {
  decimal: string;
  fractional: string;
  american: string;
  implied: string;
}

/**
 * Converts decimal odds to other formats
 */
export const fromDecimal = (decimal: number): OddsState => {
  if (isNaN(decimal) || decimal <= 1) {
    return { decimal: '', fractional: '', american: '', implied: '' };
  }

  // Decimal
  const decStr = decimal.toFixed(2);

  // Implied Probability
  const implied = (1 / decimal * 100).toFixed(2) + '%';

  // American
  let american = '';
  if (decimal >= 2) {
    american = '+' + Math.round((decimal - 1) * 100).toString();
  } else {
    american = Math.round(-100 / (decimal - 1)).toString();
  }

  // Fractional
  const fractional = decimalToFractional(decimal);

  return {
    decimal: decStr,
    fractional,
    american,
    implied
  };
};

/**
 * Converts fractional odds to decimal
 */
export const fractionalToDecimal = (fractional: string): number | null => {
  const parts = fractional.split('/');
  if (parts.length !== 2) return null;
  const num = parseFloat(parts[0]);
  const den = parseFloat(parts[1]);
  if (isNaN(num) || isNaN(den) || den === 0) return null;
  return (num / den) + 1;
};

/**
 * Converts american odds to decimal
 */
export const americanToDecimal = (american: string): number | null => {
  const val = parseInt(american);
  if (isNaN(val) || val === 0 || (val > -100 && val < 100)) return null;
  
  if (val >= 100) {
    return (val / 100) + 1;
  } else {
    return (100 / Math.abs(val)) + 1;
  }
};

/**
 * Converts implied probability to decimal
 */
export const impliedToDecimal = (implied: string): number | null => {
  const val = parseFloat(implied.replace('%', ''));
  if (isNaN(val) || val <= 0 || val >= 100) return null;
  return 100 / val;
};

/**
 * Helper to convert decimal to fractional string
 */
const decimalToFractional = (decimal: number): string => {
  let numerator = decimal - 1;
  let denominator = 1;
  
  // Simple approximation for common odds
  // For more precision, we'd use continued fractions
  const precision = 1000;
  numerator = Math.round(numerator * precision);
  denominator = precision;
  
  const commonDivisor = gcd(numerator, denominator);
  return `${numerator / commonDivisor}/${denominator / commonDivisor}`;
};

const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : a;
};
