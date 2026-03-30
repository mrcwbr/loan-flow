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

export function padLeft(num: number) {
  return num < 10 ? `0${num}` : num;
}

export function notNull<T>(value: T | null): value is T {
  return value !== null;
}

const COLORS = [
  '#66998B',
  '#489093',
  '#31869c',
  '#3578a1',
  '#4f689e',
  '#6b558e',
];

const DARLEHENSBETRAG_VALUES = [
  100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000,
  600000,
];

const SOLLZINS_VALUES = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];

const TILGUNG_VALUES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6];

function getRandomValue<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomDarlehensbetrag(): number {
  return getRandomValue(DARLEHENSBETRAG_VALUES);
}

export function getRandomSollzins(): number {
  return getRandomValue(SOLLZINS_VALUES);
}

export function getRandomTilgung(): number {
  return getRandomValue(TILGUNG_VALUES);
}

export function getNewColor(index: number): string {
  const color = COLORS.at(index);
  if (color) {
    return color;
  }

  const random = Math.floor(Math.random() * 0xffffff);
  return `#${random.toString(16).padStart(6, '0')}`;
}
