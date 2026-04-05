export type LoanData = {
  year: number;
  interest: number;
  repayment: number;
  remainingBalance: number;
  annualPayment: number;
};

export type Financing = {
  id: number;
  name: string;
  color: string;
  loanAmount: number;
  interestRate: number;
  repaymentRate: number;
  termYears: number;
};

export function calculateLoan({
  id,
  loanAmount,
  interestRate,
  repaymentRate,
  termYears,
  color,
  name,
}: Financing) {
  if (
    loanAmount <= 0 ||
    interestRate < 0 ||
    repaymentRate <= 0 ||
    termYears <= 0
  ) {
    return null;
  }

  const annualInterestRate = interestRate / 100;
  const annualPayment = loanAmount * (annualInterestRate + repaymentRate / 100);
  const monthlyPayment = annualPayment / 12;

  const data: LoanData[] = [];
  let remainingBalance = loanAmount;

  for (let year = 1; year <= termYears; year++) {
    let totalInterest = 0;
    let totalRepayment = 0;

    for (let month = 1; month <= 12; month++) {
      if (remainingBalance <= 0) break;

      const monthlyInterest = (remainingBalance * annualInterestRate) / 12;
      const monthlyPrincipal = Math.min(
        monthlyPayment - monthlyInterest,
        remainingBalance
      );

      totalInterest += monthlyInterest;
      totalRepayment += monthlyPrincipal;
      remainingBalance -= monthlyPrincipal;
    }

    data.push({
      year,
      interest: totalInterest,
      repayment: totalRepayment,
      remainingBalance: Math.max(0, remainingBalance),
      annualPayment: totalInterest + totalRepayment,
    });

    if (remainingBalance <= 0) break;
  }

  return {
    id,
    color,
    monthlyPayment,
    annualPayment,
    data,
    name,
    totalInterest: data.reduce((sum, d) => sum + d.interest, 0),
    totalRepayment: data.reduce((sum, d) => sum + d.repayment, 0),
    remainingBalance:
      data.length > 0 ? data[data.length - 1].remainingBalance : loanAmount,
  };
}
