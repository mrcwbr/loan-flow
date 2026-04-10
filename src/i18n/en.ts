export const en = {
  header: {
    title: 'Loan Calculator',
    subtitle:
      'Calculate your monthly payment and view the amortization schedule',
    language: 'Language',
    languageOptions: {
      de: 'German',
      en: 'English',
    },
  },
  form: {
    name: 'Name',
    loanAmount: 'Loan Amount',
    interestRate: 'Interest Rate (p.a.)',
    repaymentRate: 'Repayment',
    termYears: 'Term',
    color: 'Color',
    delete: 'Delete',
    help: 'Help',
    helpTexts: {
      loanAmount: 'The amount you borrow from the bank (excluding interest).',
      interestRate:
        'The annual interest rate you pay on the loan (“p.a.” = per year).',
      repaymentRate:
        'The portion in percent per year used to pay back the loan.',
    },
  },
} satisfies Record<string, TranslationNode>;

type TranslationNode = string | { [key: string]: TranslationNode };
export type TranslationSchema = typeof en;
