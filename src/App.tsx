import { Toggle, ToggleGroup } from '@base-ui/react';
import clsx from 'clsx';
import { ChartLine, Sheet } from 'lucide-react';
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
import { LCard } from './components/LCard.tsx';
import { LInput } from './components/LInput.tsx';
import { currencyFormatter, formatCurrency } from './utils.ts';

interface LoanData {
  year: number;
  zinsen: number;
  tilgung: number;
  restschuld: number;
  jahresrate: number;
}

// todo rename to english variables
// todo add input to path to be shareable?
// todo add i18n
// todo add sitemap?
export function App() {
  const [darlehensbetrag, setDarlehensbetrag] = useState(250000);
  const [sollzins, setSollzins] = useState(3.5);
  const [tilgung, setTilgung] = useState(2);
  const [laufzeit, setLaufzeit] = useState(10);

  const [showLineChart, setShowLineChart] = useState(true);

  const calculatedData = useMemo(() => {
    if (darlehensbetrag <= 0 || sollzins < 0 || tilgung <= 0 || laufzeit <= 0) {
      return null;
    }

    // Monatliche Rate berechnen (Annuität)
    const jahreszins = sollzins / 100;
    const jahresrate = darlehensbetrag * (jahreszins + tilgung / 100);
    const monatlicheRate = jahresrate / 12;

    const data: LoanData[] = [];
    let restschuld = darlehensbetrag;

    for (let year = 1; year <= laufzeit; year++) {
      let jahresZinsen = 0;
      let jahresTilgung = 0;

      // 12 Monate berechnen
      for (let month = 1; month <= 12; month++) {
        if (restschuld <= 0) break;

        const monatsZinsen = (restschuld * jahreszins) / 12;
        const monatsTilgung = Math.min(
          monatlicheRate - monatsZinsen,
          restschuld
        );

        jahresZinsen += monatsZinsen;
        jahresTilgung += monatsTilgung;
        restschuld -= monatsTilgung;
      }

      data.push({
        year,
        zinsen: jahresZinsen,
        tilgung: jahresTilgung,
        restschuld: Math.max(0, restschuld),
        jahresrate: jahresZinsen + jahresTilgung,
      });

      if (restschuld <= 0) break;
    }

    return {
      monatlicheRate,
      jahresrate,
      data,
      gesamtZinsen: data.reduce((sum, d) => sum + d.zinsen, 0),
      gesamtTilgung: data.reduce((sum, d) => sum + d.tilgung, 0),
      restschuld:
        data.length > 0 ? data[data.length - 1].restschuld : darlehensbetrag,
    };
  }, [darlehensbetrag, sollzins, tilgung, laufzeit]);

  const chartData = useMemo(() => {
    if (!calculatedData) return [];
    return calculatedData.data.map((d) => ({
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

        {/* Eingabefelder */}
        <LCard title="Darlehensdetails eingeben">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <LInput
              label="Darlehensbetrag"
              value={darlehensbetrag}
              setValue={setDarlehensbetrag}
              append="€"
            />
            <LInput
              label="Sollzins (p.a.)"
              value={sollzins}
              setValue={setSollzins}
              append="%"
            />

            <LInput
              label="Tilgung"
              value={tilgung}
              setValue={setTilgung}
              append="%"
            />
            <LInput
              label="Laufzeit"
              value={laufzeit}
              setValue={setLaufzeit}
              append="Jahre"
              step={1}
            />
          </div>
        </LCard>

        {/* Ergebnisübersicht */}
        {calculatedData && (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <LCard title="Monatliche Rate" className="bg-primary text-white">
                <div className="text-2xl font-bold">
                  {formatCurrency(calculatedData.monatlicheRate)}
                </div>
              </LCard>

              <LCard title="Zinsen gesamt">
                <div className="text-2xl font-bold">
                  {formatCurrency(calculatedData.gesamtZinsen)}
                </div>
              </LCard>

              <LCard title="Tilgung gesamt">
                <div className="text-2xl font-bold">
                  {formatCurrency(calculatedData.gesamtTilgung)}
                </div>
              </LCard>

              <LCard title="Restschuld">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(calculatedData.restschuld)}
                </div>
              </LCard>
            </div>

            <LCard title="Zinsen und Tilgung pro Jahr">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.8 0 0)"
                    />
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
            </LCard>

            <LCard
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
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
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
            </LCard>
          </>
        )}
      </div>
    </div>
  );
}

function padLeft(num: number) {
  return num < 10 ? `0${num}` : num;
}
