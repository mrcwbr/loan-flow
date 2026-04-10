import type { TranslationSchema } from './en.ts';

export const de: TranslationSchema = {
  header: {
    title: 'Darlehensrechner',
    subtitle:
      'Berechnen Sie Ihre monatliche Rate und sehen Sie den Tilgungsplan',
    language: 'Sprache',
    languageOptions: {
      de: 'Deutsch',
      en: 'Englisch',
    },
  },
  form: {
    name: 'Name',
    loanAmount: 'Darlehensbetrag',
    interestRate: 'Sollzins (p.a.)',
    repaymentRate: 'Tilgung',
    termYears: 'Laufzeit',
    color: 'Farbe',
    delete: 'Löschen',
    help: 'Hilfe',
    helpTexts: {
      loanAmount: 'Der Betrag, den du von der Bank leihst (ohne Zinsen).',
      interestRate:
        'Der jährliche Zinssatz, den du auf den Kredit zahlst („p.a.“ = pro Jahr).',
      repaymentRate:
        'Der Anteil in Prozent pro Jahr, mit dem du den Kredit zurückzahlst, also die Schulden nach und nach abbaust.',
    },
  },
};
