import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

export function currencyFormatter(value: ValueType | undefined) {
  if (typeof value === 'number') {
    return formatCurrency(value);
  }
  return value;
}
