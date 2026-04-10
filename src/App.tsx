import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateLoan, type Financing } from './calculateLoan.ts';
import { AmortizationSchedule } from './components/AmortizationSchedule.tsx';
import { LanguageSwitch } from './components/LanguageSwitch.tsx';
import { ResultTableRow } from './components/ResultTableRow.tsx';
import { LfButton } from './components/ui/LfButton.tsx';
import { LfCard } from './components/ui/LfCard.tsx';
import { LfInput } from './components/ui/LfInput.tsx';
import {
  getNewColor,
  getRandomDarlehensbetrag,
  getRandomSollzins,
  getRandomTilgung,
  notNull,
} from './utils.ts';

// todo add input to path to be shareable?
// todo add i18n
// todo add sitemap?
export function App() {
  const [financings, setFinancings] = useState<Financing[]>([
    {
      id: 1,
      color: '#65998B',
      name: 'Bank 1',
      loanAmount: 250000,
      interestRate: 3.5,
      repaymentRate: 2,
      termYears: 10,
    },
  ]);

  const calculatedData = financings
    .map((financing) => calculateLoan(financing))
    .filter(notNull);

  function addFinancing() {
    setFinancings([
      ...financings,
      {
        id: financings.length + 1,
        color: getNewColor(financings.map((f) => f.color)),
        name: `Bank ${financings.length + 1}`,
        loanAmount: getRandomDarlehensbetrag(),
        interestRate: getRandomSollzins(),
        repaymentRate: getRandomTilgung(),
        termYears: financings.at(-1)?.termYears ?? 10,
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

  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('header.title')}
            </h1>
            <p className="text-gray-600">{t('header.subtitle')}</p>
          </div>
          <LanguageSwitch />
        </header>

        <LfCard title="Darlehensdetails eingeben">
          <div className="space-y-4">
            {financings.map((financing) => (
              <div
                key={financing.id}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
              >
                <LfInput
                  label={t('form.name')}
                  value={financing.name}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'name', value as string)
                  }
                />
                <LfInput
                  label={t('form.loanAmount')}
                  value={financing.loanAmount}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'loanAmount', value as number)
                  }
                  append="€"
                  type="number"
                  help={t('form.helpTexts.loanAmount')}
                />
                <LfInput
                  label={t('form.interestRate')}
                  value={financing.interestRate}
                  onChange={(value) =>
                    updateFinancing(
                      financing.id,
                      'interestRate',
                      value as number
                    )
                  }
                  append="%"
                  type="number"
                  help={t('form.helpTexts.interestRate')}
                />
                <LfInput
                  label={t('form.repaymentRate')}
                  value={financing.repaymentRate}
                  onChange={(value) =>
                    updateFinancing(
                      financing.id,
                      'repaymentRate',
                      value as number
                    )
                  }
                  append="%"
                  type="number"
                  help={t('form.helpTexts.repaymentRate')}
                />
                <LfInput
                  label={t('form.termYears')}
                  value={financing.termYears}
                  onChange={(value) =>
                    updateFinancing(financing.id, 'termYears', value as number)
                  }
                  append="Jahre"
                  step={1}
                  type="number"
                />
                <div className="flex items-end gap-4">
                  <LfInput
                    label={t('form.color')}
                    value={financing.color}
                    onChange={(value) =>
                      updateFinancing(financing.id, 'color', value as string)
                    }
                    type="color"
                  />
                  <div>
                    <LfButton
                      title={t('form.delete')}
                      hideTitle
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
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {calculatedData.map((result, index) => (
                  <ResultTableRow
                    key={result.id}
                    result={result}
                    defaultOpen={index === 0}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </LfCard>

        <LfCard title="Tilgungsplan">
          <AmortizationSchedule calculatedData={calculatedData} />
        </LfCard>
      </div>
    </div>
  );
}
