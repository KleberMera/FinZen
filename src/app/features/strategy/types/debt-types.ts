// Types for the debt payment plan application
export interface Amortization {
  quota: string
  number_months: number
  date: string
  interest: string
  status: string
}

export interface Debt {
  id: number
  name: string
  interest_rate: string | null
  amount: string
  duration_months: number
  start_date: string
  end_date: string
  duration_type: "months" | "days"
  method: "frances" | "ninguno" | string
  amortizations: Amortization[]
  totalPaidAmount: number
  paidInstallmentsCount: number
  remainingInstallments: number
  remainingAmount: number
  minimumPayment?: number
  isOverdue?: boolean
}

export interface RecurringTransaction {
  name: string
  amount: number
  type: "Ingreso" | "Gasto"
}

export interface DebtData {
  salary: boolean
  method: "bola-de-nieve" | "avalancha"
  currentDate: string
  debts: Debt[]
  userId: number
  salaryData: number
  recurringTransactions: RecurringTransaction[]
}

export interface MonthlyPayment {
  month: number
  date: string
  payments: {
    name: string
    amount: string
    type: string
    interestAmount?: string
  }[]
  remainingBalances: {
    name: string
    amount: string
  }[]
  extraDetails: {
    interestPaid: {
      name: string
      amount: string
    }[]
    totalInterest: number
    availableAfterMinimums: number
    extraPayment: {
      name: string
      amount: string | number
    }
    focusDebt: string
    explanation: string
  }
}

export interface DebtCompletionDate {
  month: number
  date: string
}

export interface ComparisonData {
  method: "bola-de-nieve" | "avalancha"
  months: number
  totalInterest: number
  lastDate: string
}
