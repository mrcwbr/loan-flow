import { Toggle, ToggleGroup } from '@base-ui/react';
import clsx from 'clsx';
import { ChartLine, Plus, Sheet, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { calculateLoan, type Financing } from './calculateLoan.ts';
import { LfButton } from './components/LfButton.tsx';
import { LfCard } from './components/LfCard.tsx';
import { LfInput } from './components/LfInput.tsx';
import {
  currencyFormatter,
  formatCurrency,
  getNewColor,
  getRandomDarlehensbetrag,
  getRandomSollzins,
  getRandomTilgung,
  notNull,
  padLeft,
} from './utils.ts';

// todo rename to english variables
// todo add input to path to be shareable?
// todo add i18n
// todo add sitemap?
export function App() {
  const [financings, setFinancings] = useState<Financing[]>([
    {
      id: 1,
      color: '#65998B',
      name: 'Bank 1',
      darlehensbetrag: 250000,
      sollzins: 3.5,
      tilgung: 2,
      laufzeit: 10,
    },
  ]);

  const [showLineChart, setShowLineChart] = useState(true);

  const calculatedData = financings
    .map((financing) => calculateLoan(financing))
    .filter(notNull);

  function addFinancing() {
    setFinancings([
      ...financings,
      {
        id: financings.length + 1,
        color: getNewColor(financings.length + 1),
        name: `Bank ${financings.length + 1}`,
        darlehensbetrag: getRandomDarlehensbetrag(),
        sollzins: getRandomSollzins(),
        tilgung: getRandomTilgung(),
        laufzeit: financings.at(-1)?.laufzeit ?? 10,
      },
    ]);
  }

  function updateFinancing<T extends keyof Financing>(
    id: number,
    field: T,
    value: Financing[T]
  ) {
    setFinancings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  }

  function removeFinancing(id: number) {
    if (financings.length <= 1) return;
    const newFinancings = financings.filter((f) => f.id !== id);
    setFinancings(newFinancings);
  }

  const chartData = useMemo(() => {
    if (!calculatedData) return [];
    // todo remove at(0)!
    return calculatedData.at(0)!.data.map((d) => ({
      name: `Jahr ${d.year}`,
      Zinsen: Math.round(d.zinsen),
      Tilgung: Math.round(d.tilgung),
    }));
  }, [calculatedData]);

  const styles = getComputedStyle(document.documentElement);
  const primaryColor = styles.getPropertyValue('--color-primary');
  const primaryColor800 = styles.getPropertyValue('--color-primary-800');
  const gray950 = styles.getPropertyValue('--color-gray-950');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Darlehensrechner
          </h1>
          <p className="mt-2 text-gray-600">
            Berechnen Sie Ihre monatliche Rate und sehen Sie den Tilgungsplan
          </p>
        </header>

        <LfCard title="Darlehensdetails eingeben">
          <div className="space-y-4">
            {financings.map((financing) => (
              <div
                key={financing.id}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
              >
                <LfInput
                  label="Name"
                  value={financing.name}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'name', value as string)
                  }
                />
                <LfInput
                  label="Darlehensbetrag"
                  value={financing.darlehensbetrag}
                  onChange={(value) =>
                    updateFinancing(
                      financing.id,
                      'darlehensbetrag',
                      value as number
                    )
                  }
                  append="€"
                  type="number"
                />
                <LfInput
                  label="Sollzins (p.a.)"
                  value={financing.sollzins}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'sollzins', value as number)
                  }
                  append="%"
                  type="number"
                />
                <LfInput
                  label="Tilgung"
                  value={financing.tilgung}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'tilgung', value as number)
                  }
                  append="%"
                  type="number"
                />
                <LfInput
                  label="Laufzeit"
                  value={financing.laufzeit}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'laufzeit', value as number)
                  }
                  append="Jahre"
                  step={1}
                  type="number"
                />
                <div className="flex items-end gap-4">
                  <LfInput
                    label="Farbe"
                    value={financing.color}
                    onChange={(value) =>
                      updateFinancing(financing.id, 'color', value as string)
                    }
                    type="color"
                  />
                  <div>
                    <LfButton
                      title="Delete"
                      icon={Trash2}
                      disabled={financings.length <= 1}
                      onClick={() => removeFinancing(financing.id)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <LfButton
              icon={Plus}
              title="Add Financing"
              className="w-full"
              onClick={addFinancing}
            />
          </div>
        </LfCard>

        <LfCard title="Ergebnis" padding={false}>
          <div className="min-w-full">
            <table className="relative min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">Name</th>
                  <th className="p-4 text-right text-sm font-semibold">
                    Monatliche Rate
                  </th>
                  <th className="p-4 text-right text-sm font-semibold">
                    Zinsen gesamt
                  </th>
                  <th className="p-4 text-right text-sm font-semibold">
                    Tilgung gesamt
                  </th>
                  <th className="p-4 text-right text-sm font-semibold">
                    Restschuld
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-gray-900">
                {calculatedData.map((data) => (
                  <tr key={data.id}>
                    <td className="px-4 py-2 text-sm whitespace-nowrap">
                      <span
                        className="rounded-md px-2 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: data.color }}
                      >
                        {data.name}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-sm whitespace-nowrap">
                      {formatCurrency(data.monatlicheRate)}
                    </td>
                    <td className="px-4 py-2 text-right text-sm whitespace-nowrap">
                      {formatCurrency(data.gesamtZinsen)}
                    </td>
                    <td className="px-4 py-2 text-right text-sm whitespace-nowrap">
                      {formatCurrency(data.gesamtTilgung)}
                    </td>
                    <td
                      className="px-4 py-2 text-right text-sm font-semibold whitespace-nowrap"
                      style={{ color: data.color }}
                    >
                      {formatCurrency(data.restschuld)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LfCard>

        <LfCard title="Zinsen und Tilgung pro Jahr">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.8 0 0)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'oklch(0.2 0.05 270)', fontSize: 12 }}
                  axisLine={{ stroke: 'oklch(0.2 0.05 270)' }}
                />
                <YAxis
                  tick={{ fill: 'oklch(0.2 0.05 270)', fontSize: 12 }}
                  axisLine={{ stroke: 'oklch(0.2 0.05 270)' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={currencyFormatter}
                  labelStyle={{ color: 'oklch(0.2 0.05 270)' }}
                  contentStyle={{
                    backgroundColor: 'oklch(1 0 0)',
                    border: '2px solid oklch(0.2 0.05 270)',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Zinsen"
                  stackId="a"
                  fill={primaryColor800}
                  name="Zinsen"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Tilgung"
                  stackId="a"
                  fill={primaryColor}
                  name="Tilgung"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </LfCard>

        <LfCard
          title="Tilgungsplan"
          actions={
            <ToggleGroup
              value={[showLineChart ? 'line' : 'table']}
              onValueChange={(value) =>
                setShowLineChart(value.includes('line'))
              }
              className="flex gap-px rounded-md border border-gray-200 bg-gray-100 p-0.5"
            >
              <Toggle
                aria-label="Line Chart"
                value="line"
                className="flex size-8 items-center justify-center rounded-xs text-gray-600 select-none hover:bg-gray-100 focus-visible:bg-none focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-200 data-pressed:bg-white data-pressed:text-primary"
              >
                <ChartLine />
              </Toggle>
              {/*todo text primary and own component*/}
              <Toggle
                aria-label="Table"
                value="table"
                className="flex size-8 items-center justify-center rounded-xs text-gray-600 select-none hover:bg-gray-100 focus-visible:bg-none focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-200 data-pressed:bg-white data-pressed:text-primary"
              >
                <Sheet />
              </Toggle>
            </ToggleGroup>
          }
        >
          {showLineChart ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={calculatedData.data}
                  margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.8 0 0)"
                  />
                  <XAxis
                    dataKey="year"
                    label="Jahre"
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
                      backgroundColor: 'oklch(1 0 0)',
                      border: '2px solid oklch(0.2 0.05 270)',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="restschuld"
                    stroke={primaryColor}
                    strokeWidth={3}
                    dot={{
                      fill: primaryColor,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6 }}
                    name="Restschuld"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold tracking-wide uppercase">
                      Jahr
                    </th>
                    <th className="text-right font-semibold tracking-wide uppercase">
                      Jahresrate
                    </th>
                    <th className="text-right font-semibold tracking-wide uppercase">
                      Zinsen
                    </th>
                    <th className="text-right font-semibold tracking-wide uppercase">
                      Tilgung
                    </th>
                    <th className="text-right font-semibold tracking-wide uppercase">
                      Restschuld
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedData.data.map((row, index) => (
                    <tr
                      key={row.year}
                      className={clsx({ 'bg-gray-50': index % 2 === 0 })}
                    >
                      <td className="font-mono">{padLeft(row.year)}</td>
                      {/*todo geist mono*/}
                      <td className="text-right font-mono">
                        {formatCurrency(row.jahresrate)}
                      </td>
                      <td className="text-right font-mono text-primary">
                        {formatCurrency(row.zinsen)}
                      </td>
                      <td className="text-right font-mono">
                        {formatCurrency(row.tilgung)}
                      </td>
                      <td className="text-right font-mono">
                        {formatCurrency(row.restschuld)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </LfCard>
      </div>
    </div>
  );
}
