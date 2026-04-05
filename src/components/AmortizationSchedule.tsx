import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { LoanData } from '../calculateLoan.ts';
import { currencyFormatter } from '../utils.ts';

export function AmortizationSchedule({
  calculatedData,
}: {
  calculatedData: {
    data: LoanData[];
    color: string;
    name: string;
    id: number;
  }[];
}) {
  const maxYears = Math.max(...calculatedData.map((c) => c?.data.length ?? 0));

  const chartData: Record<string, number | null>[] = [];

  for (let year = 1; year <= maxYears; year++) {
    const row: Record<string, number | null> = { year };
    calculatedData.forEach((c) => {
      if (!c) return;
      const dataForYear = c.data.find((d) => d.year === year);
      row[`finance_${c.id}`] = dataForYear?.remainingBalance ?? null;
    });
    chartData.push(row);
  }

  const styles = getComputedStyle(document.documentElement);
  const gray950 = styles.getPropertyValue('--color-gray-950');
  const gray300 = styles.getPropertyValue('--color-gray-300');

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gray300} />
          <XAxis
            dataKey="year"
            tickFormatter={(value) => `Jahr ${value}`}
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
          {calculatedData.map((result) => (
            <Line
              key={result.id}
              type="monotone"
              dataKey={`finance_${result.id}`}
              stroke={result.color}
              strokeWidth={3}
              dot={{
                fill: result.color,
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{ r: 6 }}
              name={result.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
