import { Amortization } from "./amortization";

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
    //fixedDay: boolean;
    status: string;
    amortizations: Amortization[];
  }
  