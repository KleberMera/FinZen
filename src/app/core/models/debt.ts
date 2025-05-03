import { Amortization } from './amortization';

export interface Debt {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  amount: number;
  interest_rate: number;
  duration_months: number;
  method: string;
  start_date: string;
  end_date: string;
  status: string;
  amortizations: Amortization[];
}

export interface StrategyMethod {
  method: string;
  salary: boolean;
  debtIds: number[];
  userId: number;
  salaryData?: number;
}

export interface StrategyPlanComponentProps {
  currentDate: string;
  method: string;
  currentSalary: number;
  debts: Debt[];
}
