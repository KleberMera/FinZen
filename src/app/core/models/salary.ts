export interface Salary {
    id?: number;
    user_id: number;
    salary_amount: number;
    effective_date: string;
    month_name: string;
    description?: string;
  }


 export  interface MonthlyExpenseRequest {
    userId: number;
    month: number;
    year: number;
  }