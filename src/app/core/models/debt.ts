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
  // Nuevos campos
  formattedStartDate?: string;
  formattedEndDate?: string;
  loanAmount?: number;
  totalAmountToPay?: number;
  totalPaidAmount: number;
  remainingAmount: number;
  totalInterest?: number;
  paidInterest?: number;
  remainingInterest?: number;
  totalAmortized?: number;
  paidAmortized?: number;
  remainingAmortized?: number;
  totalInstallments?: number;
  paidInstallments: number;
  pendingInstallments?: number;
  overdueInstallments?: number;
  paymentProgress?: number;
  installmentProgress?: number;
  nextPaymentDue?: string;
  nextPaymentAmount?: string;
  nextPaymentFormatted?: string;
  lastPaymentDate?: string | null;
  lastPaymentAmount?: number | null;
  lastPaymentFormatted?: string | null;
  totalOverdueAmount?: number;
  hasOverduePayments?: boolean;
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


// {
// 		"id": 2,
// 		"category_id": 2,
// 		"name": "Pago de pasaje",
// 		"description": "Gasto en pasajes.",
// 		"amount": "1.05",
// 		"date": "2025-04-20",
// 		"time": "12:08:23",
// 		"receiptImageS3Key": null,
// 		"isRecurring": true,
// 		"createdAt": "2025-04-20T17:08:26.681Z",
// 		"updatedAt": "2025-05-13T14:37:07.947Z",
// 		"category": {
// 			"type": "Gasto",
// 			"icon": "pi pi-car"
// 		}
// 	}
export interface RecurringTransactionAll {
  id ?: number
  category_id: number
  name: string
  description: string
  amount: string
  date: string
  time: string
  frequency: string
  receiptImageS3Key: string | null
  isRecurring: boolean
    category: {
    type: "Gasto" | "Ingreso"
    icon: string
  }

}
