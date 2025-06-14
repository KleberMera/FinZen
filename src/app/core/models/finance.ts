export interface FinanceSummary {
  totalIncome: number;
  salaryAmount: number;
  otherIncome: number;
  totalExpenses: number;
  totalDebtPaid: number;
  totalGoalContributionPaid: number;
  totalExpensesWithDebtAndGoals: number;
  netBalance: number;
  expensePercentage: number;
  daysPassedPercentage: number;
  expectedExpensesByTime: number;
  timeAdjustedExpensePercentage: number;
  recommendation: string;
  monthName: string
  month: number;
  year: number;

}
