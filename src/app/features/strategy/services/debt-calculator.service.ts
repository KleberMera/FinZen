import { Injectable } from "@angular/core"
import { addMonths, format, differenceInDays, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import type { Debt, MonthlyPayment, DebtData } from "../types/debt-types"

interface DebtCompletionDate {
  month: number
  date: string
}

@Injectable({
  providedIn: "root",
})
export class DebtCalculatorService {
  constructor() {}

  // Process debts with additional information
  processDebts(debts: Debt[], currentDate: string): Debt[] {
    const currentDateObj = new Date(currentDate)

    return debts.map((debt) => {
      const endDate = new Date(debt.end_date)
      const isOverdue = isBefore(endDate, currentDateObj)

      // Calculate minimum payment based on amortizations
      let minimumPayment = 0

      if (debt.amortizations.length > 0) {
        minimumPayment = Number.parseFloat(debt.amortizations[0].quota)
      } else if (debt.duration_type === "months") {
        minimumPayment = Number.parseFloat(debt.amount) / debt.duration_months
      } else if (debt.duration_type === "days") {
        // For debts in days, calculate the daily payment and multiply by 30 to get a monthly equivalent
        const daysRemaining = differenceInDays(new Date(debt.end_date), currentDateObj)
        minimumPayment = Number.parseFloat(debt.amount) / (daysRemaining > 0 ? daysRemaining : 1)
        // Convert to an approximate monthly equivalent
        minimumPayment = minimumPayment * 30
      }

      return {
        ...debt,
        isOverdue,
        minimumPayment,
      }
    })
  }

  // Calculate the monthly available amount
  calculateMonthlyAvailable(debtData: DebtData): number {
    const salary = Number(debtData.salaryData)
    const income = debtData.recurringTransactions
      .filter((t) => t.type === "Ingreso")
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = debtData.recurringTransactions
      .filter((t) => t.type === "Gasto")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return salary + income - expenses
  }

  // Calculate payment plan
  calculatePaymentPlan(
    debts: Debt[],
    method: "bola-de-nieve" | "avalancha",
    monthlyAvailable: number,
    currentDate: string,
  ): MonthlyPayment[] {
    // If there are not enough funds, don't calculate the plan
    if (monthlyAvailable <= 0) {
      return []
    }

    // Prepare debts for calculation
    let currentDebts = debts.map((debt) => ({
      id: debt.id,
      name: debt.name,
      balance: debt.remainingAmount,
      interestRate: debt.interest_rate ? Number.parseFloat(debt.interest_rate) / 100 / 12 : 0,
      minimumPayment: debt.minimumPayment || 0,
      isOverdue: debt.isOverdue || false,
      durationType: debt.duration_type,
      method: debt.method,
      endDate: new Date(debt.end_date),
      remainingInstallments: debt.remainingInstallments,
    }))

    const monthlyPayments: MonthlyPayment[] = []
    let month = 0
    let currentDateObj = new Date(currentDate)
    const totalMonthlyAvailable = monthlyAvailable

    // Continue until all debts are paid
    while (currentDebts.some((debt) => debt.balance > 0)) {
      month++

      // Advance one month in the date
      currentDateObj = addMonths(new Date(currentDateObj), 1)


      let availableFunds = totalMonthlyAvailable
      const monthData: MonthlyPayment = {
        month,
        date: format(currentDateObj, "MMM yyyy", { locale: es }),
        payments: [],
        remainingBalances: [],
        extraDetails: {
          interestPaid: [],
          totalInterest: 0,
          availableAfterMinimums: 0,
          extraPayment: { name: "", amount: 0 },
          focusDebt: "",
          explanation: "",
        },
      }

      // Calculate interest and update balances
      currentDebts = currentDebts.map((debt) => {
        let interest = 0

        // Calculate interest according to the amortization method
        if (debt.balance > 0) {
          if (debt.method === "frances") {
            interest = debt.balance * debt.interestRate
          }
          // For method "ninguno" or any other, no additional interest is calculated
        }

        // Save information about interest paid
        if (interest > 0) {
          monthData.extraDetails.interestPaid.push({
            name: debt.name,
            amount: interest.toFixed(2),
          })
          monthData.extraDetails.totalInterest += interest
        }

        return {
          ...debt,
          balance: debt.balance + interest,
        }
      })

      // First pay overdue debts
      const overdueDebts = currentDebts.filter((debt) => debt.isOverdue && debt.balance > 0)

      if (overdueDebts.length > 0) {
        // Sort overdue debts by balance (lowest to highest)
        overdueDebts.sort((a, b) => a.balance - b.balance)

        monthData.extraDetails.explanation = "Este mes hay deudas vencidas. Primero debemos ponerlas al día."
        monthData.extraDetails.focusDebt = overdueDebts[0].name

        // Pay minimums on all non-overdue debts
        currentDebts.forEach((debt) => {
          if (!debt.isOverdue && debt.balance > 0) {
            const payment = Math.min(debt.minimumPayment, debt.balance)
            debt.balance -= payment
            availableFunds -= payment

            // Calculate how much of the payment is interest
            const interestPortion = monthData.extraDetails.interestPaid.find((i) => i.name === debt.name)
            const interestAmount = interestPortion ? Number.parseFloat(interestPortion.amount) : 0
            const principalAmount = payment - interestAmount

            monthData.payments.push({
              name: debt.name,
              amount: payment.toFixed(2),
              type: "mínimo",
              interestAmount: interestAmount.toFixed(2),
            })
          }
        })

        monthData.extraDetails.availableAfterMinimums = availableFunds

        // Pay the smallest overdue debt first
        for (let i = 0; i < overdueDebts.length; i++) {
          const debt = currentDebts.find((d) => d.name === overdueDebts[i].name)!

          if (i === 0) {
            // For the smallest overdue debt, pay as much as we can
            const payment = Math.min(availableFunds, debt.balance)
            debt.balance -= payment
            availableFunds -= payment

            // Calculate how much of the payment is interest
            const interestPortion = monthData.extraDetails.interestPaid.find((i) => i.name === debt.name)
            const interestAmount = interestPortion ? Number.parseFloat(interestPortion.amount) : 0
            const principalAmount = payment - interestAmount

            monthData.payments.push({
              name: debt.name,
              amount: payment.toFixed(2),
              type: "prioritario",
              interestAmount: interestAmount.toFixed(2),
            })

            monthData.extraDetails.extraPayment = {
              name: debt.name,
              amount: payment - debt.minimumPayment > 0 ? (payment - debt.minimumPayment).toFixed(2) : "0.00",
            }

            // If we paid in full, mark as not overdue
            if (debt.balance <= 0) {
              debt.isOverdue = false
            }
          } else {
            // For other overdue debts, pay the minimum
            const payment = Math.min(debt.minimumPayment, debt.balance)
            debt.balance -= payment
            availableFunds -= payment

            // Calculate how much of the payment is interest
            const interestPortion = monthData.extraDetails.interestPaid.find((i) => i.name === debt.name)
            const interestAmount = interestPortion ? Number.parseFloat(interestPortion.amount) : 0
            const principalAmount = payment - interestAmount

            monthData.payments.push({
              name: debt.name,
              amount: payment.toFixed(2),
              type: "mínimo",
              interestAmount: interestAmount.toFixed(2),
            })

            // If we paid in full, mark as not overdue
            if (debt.balance <= 0) {
              debt.isOverdue = false
            }
          }
        }
      } else {
        // Snowball or avalanche method
        // Sort debts according to the selected method
        const sortedDebts = [...currentDebts]
          .filter((debt) => debt.balance > 0)
          .sort((a, b) => {
            if (method === "bola-de-nieve") {
              return a.balance - b.balance // Lowest balance first
            } else {
              return (b.interestRate || 0) - (a.interestRate || 0) // Highest interest first
            }
          })

        if (sortedDebts.length > 0) {
          monthData.extraDetails.focusDebt = sortedDebts[0].name
          monthData.extraDetails.explanation = `Aplicando el método ${
            method === "bola-de-nieve" ? "bola de nieve" : "avalancha"
          }, nos enfocamos en ${
            method === "bola-de-nieve" ? "la deuda más pequeña" : "la deuda con mayor interés"
          }: ${sortedDebts[0].name}.`
        }

        // Pay minimums on all debts
        currentDebts.forEach((debt) => {
          if (debt.balance > 0) {
            const payment = Math.min(debt.minimumPayment, debt.balance)
            debt.balance -= payment
            availableFunds -= payment

            // Calculate how much of the payment is interest
            const interestPortion = monthData.extraDetails.interestPaid.find((i) => i.name === debt.name)
            const interestAmount = interestPortion ? Number.parseFloat(interestPortion.amount) : 0
            const principalAmount = payment - interestAmount

            monthData.payments.push({
              name: debt.name,
              amount: payment.toFixed(2),
              type: "mínimo",
              interestAmount: interestAmount.toFixed(2),
            })
          }
        })

        monthData.extraDetails.availableAfterMinimums = availableFunds

        // Pay extra on the priority debt
        if (sortedDebts.length > 0 && availableFunds > 0) {
          const priorityDebt = currentDebts.find((d) => d.name === sortedDebts[0].name)!
          const extraPayment = Math.min(availableFunds, priorityDebt.balance)

          if (extraPayment > 0) {
            priorityDebt.balance -= extraPayment

            // Update the payment in monthData.payments
            const paymentIndex = monthData.payments.findIndex((p) => p.name === priorityDebt.name)
            if (paymentIndex !== -1) {
              const currentPayment = Number.parseFloat(monthData.payments[paymentIndex].amount)
              monthData.payments[paymentIndex].amount = (currentPayment + extraPayment).toFixed(2)
              monthData.payments[paymentIndex].type = method === "bola-de-nieve" ? "bola de nieve" : "avalancha"

              monthData.extraDetails.extraPayment = {
                name: priorityDebt.name,
                amount: extraPayment.toFixed(2),
              }
            }
          }
        }
      }

      // Record remaining balances
      currentDebts.forEach((debt) => {
        monthData.remainingBalances.push({
          name: debt.name,
          amount: debt.balance.toFixed(2),
        })
      })

      monthlyPayments.push(monthData)

      // Avoid infinite loops if something goes wrong
      if (month > 120) break
    }

    return monthlyPayments
  }

  findDebtCompletionDates(paymentPlan: MonthlyPayment[], processedDebts: Debt[]): Record<string, DebtCompletionDate> {
    const dates: Record<string, DebtCompletionDate> = {}
    processedDebts.forEach((debt) => {
      const completionMonth = paymentPlan.findIndex(
        (month) => month.remainingBalances.find((b) => b.name === debt.name)?.amount === "0.00",
      )
      if (completionMonth !== -1) {
        dates[debt.name] = {
          month: completionMonth + 1,
          date: paymentPlan[completionMonth].date,
        }
      }
    })
    return dates
  }

  // Calculate chart data
  calculateChartData(paymentPlan: MonthlyPayment[]): any[] {
    return paymentPlan.map((month) => {
      const data: any = { month: month.date }
      month.remainingBalances.forEach((balance) => {
        data[balance.name] = Number.parseFloat(balance.amount)
      })
      return data
    })
  }

  // Calculate pie data
  calculatePieData(processedDebts: Debt[]): any[] {
    return processedDebts.map((debt) => ({
      name: debt.name,
      value: debt.remainingAmount,
      interestRate: debt.interest_rate ? Number.parseFloat(debt.interest_rate) : 0,
    }))
  }

  // Calculate total interest paid
  calculateTotalInterestPaid(paymentPlan: MonthlyPayment[]): number {
    return paymentPlan.reduce((total, month) => {
      return total + month.extraDetails.totalInterest
    }, 0)
  }

  // Calculate total paid
  calculateTotalPaid(paymentPlan: MonthlyPayment[]): number {
    return paymentPlan.reduce((total, month) => {
      return total + month.payments.reduce((sum, payment) => sum + Number.parseFloat(payment.amount), 0)
    }, 0)
  }

  // Calculate original debt total
  calculateOriginalDebtTotal(processedDebts: Debt[]): number {
    return processedDebts.reduce((total, debt) => total + Number.parseFloat(debt.amount), 0)
  }
}
