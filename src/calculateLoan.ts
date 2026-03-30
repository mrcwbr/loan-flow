export type LoanData = {
  year: number;
  zinsen: number; // total
  tilgung: number;
  restschuld: number;
  jahresrate: number;
};

export type Financing = {
  id: number;
  name: string;
  color: string;
  darlehensbetrag: number;
  sollzins: number;
  tilgung: number;
  laufzeit: number;
};

export function calculateLoan({
  id,
  darlehensbetrag,
  sollzins,
  tilgung,
  laufzeit,
  color,
  name,
}: Financing) {
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

    for (let month = 1; month <= 12; month++) {
      if (restschuld <= 0) break;

      const monatsZinsen = (restschuld * jahreszins) / 12;
      const monatsTilgung = Math.min(monatlicheRate - monatsZinsen, restschuld);

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
    id,
    color,
    monatlicheRate,
    jahresrate,
    data,
    name,
    gesamtZinsen: data.reduce((sum, d) => sum + d.zinsen, 0),
    gesamtTilgung: data.reduce((sum, d) => sum + d.tilgung, 0),
    restschuld:
      data.length > 0 ? data[data.length - 1].restschuld : darlehensbetrag,
  };
}
