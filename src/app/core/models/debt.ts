import { Amortization } from './amortization';


export interface Debt {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  amount: number;
  interest_rate: number;
  duration_months: number;
  duration_type: string;
  method: string;
  start_date: string;
  end_date: string;
  status: string;
  amortizations: Amortization[];
  totalPaidAmount: number;
  paidInstallmentsCount: number;
  remainingInstallments: number;
  remainingAmount: number;
  minimumPayment?: number
  isOverdue?: boolean
}

export interface StrategyMethod {
  method: "bola-de-nieve" | "avalancha"
  salary: boolean;
  debts: Debt[];
  userId: number;
  salaryData?: number;
  recurringTransactions:RecurringTransaction[]
  currentDate: string;
}


export interface RecurringTransaction {
  name: string
  amount: string
  type: "Ingreso" | "Gasto"
}

export interface StrategyPlanComponentProps {
  currentDate: string;
  method: string;
  currentSalary: number;
  debts: Debt[];
}
