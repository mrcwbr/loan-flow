import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { LoanData } from '../calculateLoan.ts';
import { currencyFormatter, darkenColor, formatCurrency } from '../utils.ts';

export function ResultTableRow({
  result: {
    id,
    color,
    data,
    monthlyPayment,
    name,
    remainingBalance,
    totalInterest,
    totalRepayment,
  },
  defaultOpen,
}: {
  defaultOpen: boolean;
  result: {
    id: number;
    color: string;
    name: string;
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
    remainingBalance: number;
    data: LoanData[];
  };
}) {
  const [showChart, setShowChart] = useState(defaultOpen);

  const chartData = data.map((d) => ({
    name: `Jahr ${d.year}`,
    interest: d.interest,
    repayment: d.repayment,
  }));

  const styles = getComputedStyle(document.documentElement);
  const gray950 = styles.getPropertyValue('--color-gray-950');
  const gray300 = styles.getPropertyValue('--color-gray-300');

  return (
    <>
      <tr>
        <td className="px-4 py-2 text-sm whitespace-nowrap">
          <span
            className="rounded-md px-2 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
        </td>
        <td className="px-4 py-2 text-right text-sm whitespace-nowrap">
          {formatCurrency(monthlyPayment)}
        </td>
        <td className="px-4 py-2 text-right text-sm whitespace-nowrap">
          {formatCurrency(totalInterest)}
        </td>
        <td className="px-4 py-2 text-right text-sm whitespace-nowrap">
          {formatCurrency(totalRepayment)}
        </td>
        <td className="px-4 py-2 text-right text-sm font-semibold whitespace-nowrap">
          {formatCurrency(remainingBalance)}
        </td>
        <td className="px-4">
          <button
            className="ml-auto flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold transition-colors hover:bg-gray-200"
            onClick={() => setShowChart((value) => !value)}
            style={{ color }}
          >
            <ChevronDown
              className={clsx('size-4 cursor-pointer transition-transform', {
                'rotate-180': showChart,
              })}
            />
            Zinsen & Tilgung
          </button>
        </td>
      </tr>
      {showChart && (
        <tr>
          <td colSpan={6}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 24, right: 16, left: -16, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gray300} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: gray950, fontSize: 12 }}
                    axisLine={{ stroke: gray950 }}
                  />
                  <YAxis
                    tick={{ fill: gray950, fontSize: 12 }}
                    axisLine={{ stroke: gray950 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    labelStyle={{ color: gray950 }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: `1px solid ${gray300}`,
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="interest"
                    stackId={id}
                    fill={color}
                    name="Zinsen"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="repayment"
                    stackId={id}
                    fill={darkenColor(color)}
                    name="Tilgung"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
