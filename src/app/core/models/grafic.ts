import { Category } from './category';

export interface WeeklyDataItem {
  day: string; // Día de la semana
  gasto: number; // Gastos en el día
  ingreso: number; // Ingresos en el día
}

export interface FilterTransactionStatistics {
  month: number;
  year: number;
  endMonth?: number;
  endYear?: number;
}


export interface MonthlyDataItem {
  month: string; // Mes
  year: number; // Año
  income: number; // Total de ingresos
  expense: number; // Total de gastos
  balance: number; // Balance (ingresos - gastos)
  incomeDetails: IncomeDetail[]; // Detalles de ingresos
  expenseDetails: ExpenseDetail[]; // Detalles de gastos
}
export interface IncomeDetail {
  id: number; // ID del ingreso
  category_id: number; // ID de la categoría
  name: string; // Nombre del ingreso
  description: string; // Descripción del ingreso
  amount: string; // Monto del ingreso
  date: string; // Fecha del ingreso
  time: string; // Hora del ingreso
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de actualización
  category: Category; // Categoría asociada al ingreso
}

export interface ExpenseDetail {
  id: number; // ID del gasto
  category_id: number; // ID de la categoría
  name: string; // Nombre del gasto
  description: string; // Descripción del gasto
  amount: string; // Monto del gasto
  date: string; // Fecha del gasto
  time: string; // Hora del gasto
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de actualización
  category: Category; // Categoría asociada al gasto
}



export interface CategoryExpenseDistribution {
  categoryId: number;
  categoryName: string;
  icon: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  userCount?: number; // Para admin: cantidad de usuarios que usaron esta categoría
}


export interface TrendData {
  period: string; // "2024-01" formato
  categoryId: number;
  categoryName: string;
  icon: string;
  totalAmount: number;
  transactionCount: number;
  userCount?: number; // Para admin: cantidad de usuarios que usaron esta categoría en este período
}







export interface TransactionStatistics {
  periods: Period[]
  total: Total
}

export interface Period {
  period: string
  totalTransactions: number
  income: Income
  expense: Expense
  balance: number
  transactionsWithReceipt: number
  transactionsWithoutReceipt: number
}

export interface Income {
  total: number
  transactions: number
}

export interface Expense {
  total: number
  transactions: number
}

export interface Total {
  period: string
  totalTransactions: number
  income: IncomeTotal
  expense: ExpenseTotal
  balance: number
  transactionsWithReceipt: number
  transactionsWithoutReceipt: number
}

export interface IncomeTotal {
  total: number
  transactions: number
}

export interface ExpenseTotal {
  total: number
  transactions: number
}
