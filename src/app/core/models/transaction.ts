import { Category } from "./category";

export interface Transaction {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  amount: number;
  date: string;
  type?: string;
  payment_method?: string
  category?: Category;
  time: string;
  createdAt?: string;
  isRecurring?: boolean;
  recurringConfig?: RecurringConfig;
}

export interface TransactionMultiple {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  amount: number;
  date: string;
  type?: string;
  payment_method?: string
  category?: Category;
  categoryName?: string;
  icon?: string;
  time: string;
  createdAt?: string;
  isRecurring?: boolean;
  recurringConfig?: RecurringConfig;
}


export interface TransactionName {
  id: number;
  name: string;
}




export interface TransactionReport {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  amount: number;
  date: string;
  type: "Ingreso" | "Gasto"
  payment_method?: string
  category: Category;
  time: string;
  createdAt?: string;
}




export interface TransactionRecurring extends Transaction {
  category: Category
}



export interface RecurringConfig {
  id?: number;
  frequency: string;
  nextExecutionDate: string;
  endDate?: string;
  dayOfMonth?: number;
  lastExecuted?: string;
  generatedTransactions?: Transaction[];
}