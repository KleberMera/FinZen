import { Category } from './category';

export interface WeeklyDataItem {
  day: string; // Día de la semana
  gasto: number; // Gastos en el día
  ingreso: number; // Ingresos en el día
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
