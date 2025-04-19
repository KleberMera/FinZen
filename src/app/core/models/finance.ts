export interface FinanceSummary {
  totalIncome: number;
  salaryAmount: number;
  otherIncome: number;
  totalExpenses: number;
  netBalance: number;
  expensePercentage: number;
  daysPassedPercentage: number;
  expectedExpensesByTime: number;
  timeAdjustedExpensePercentage: number;
  recommendation: string;
}
