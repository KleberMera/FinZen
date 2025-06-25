import { Injectable } from "@angular/core"
// Importaciones necesarias para manejo de fechas y tipos
import { addMonths, format, differenceInDays, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import type { Debt, MonthlyPayment, DebtData } from "../types/debt-types"

/**
 * Define la estructura para almacenar cuándo se terminará de pagar cada deuda
 * - month: número del mes en que se termina de pagar
 * - date: fecha en formato texto (ej: "Ene 2024")
 */
interface DebtCompletionDate {
  month: number
  date: string
}

/**
 * Servicio principal para calcular estrategias de pago de deudas.
 * Implementa métodos de bola de nieve y avalancha.
 */
@Injectable({
  providedIn: "root",
})
export class DebtCalculatorService {
  constructor() {}

  /**
   * Prepara las deudas para el cálculo añadiendo:
   * - Estado de vencimiento (isOverdue)
   * - Pago mínimo mensual según el tipo de deuda:
   *   * Por cuotas: usa el valor de la primera amortización
   *   * Por meses: divide el monto total entre la duración
   *   * Por días: calcula un equivalente mensual
   */
  processDebts(debts: Debt[], currentDate: string): Debt[] {
    const currentDateObj = new Date(currentDate)

    return debts.map((debt) => {
      const endDate = new Date(debt.end_date)
      // Determina si la deuda está vencida
      const isOverdue = isBefore(endDate, currentDateObj)

      // Calcula el pago mínimo según el tipo de deuda
      let minimumPayment = 0

      if (debt.amortizations.length > 0) {
        // Si tiene amortizaciones, toma la primera cuota como pago mínimo
        minimumPayment = Number.parseFloat(debt.amortizations[0].quota)
      } else if (debt.duration_type === "months") {
        // Si es por meses, divide el monto entre la duración
        minimumPayment = Number.parseFloat(debt.amount) / debt.duration_months
      } else if (debt.duration_type === "days") {
        // Si es por días, calcula el pago diario y lo multiplica por 30 para obtener un equivalente mensual
        const daysRemaining = differenceInDays(new Date(debt.end_date), currentDateObj)
        minimumPayment = Number.parseFloat(debt.amount) / (daysRemaining > 0 ? daysRemaining : 1)
        minimumPayment = minimumPayment * 30
      }

      return {
        ...debt,
        isOverdue,
        minimumPayment,
      }
    })
  }

  /**
   * Calcula cuánto dinero hay disponible mensualmente para pagar deudas.
   * Fórmula: Salario base + Ingresos recurrentes - Gastos recurrentes
   */
  calculateMonthlyAvailable(debtData: DebtData): number {
    const salary = Number(debtData.salaryData)
    // Suma todos los ingresos recurrentes
    const income = debtData.recurringTransactions
      .filter((t) => t.type === "Ingreso")
      .reduce((sum, t) => sum + Number(t.amount), 0)
    // Suma todos los gastos recurrentes
    const expenses = debtData.recurringTransactions
      .filter((t) => t.type === "Gasto")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return salary + income - expenses
  }

  /**
   * Genera el plan mensual de pagos según la estrategia elegida:
   * - Bola de nieve: Prioriza la deuda más pequeña
   * - Avalancha: Prioriza la deuda con mayor tasa de interés
   * 
   * El proceso para cada mes:
   * 1. Calcula intereses según el método de cada deuda
   * 2. Paga el mínimo de todas las deudas
   * 3. El dinero extra se aplica a la deuda priorizada
   * 4. Si hay deudas vencidas, tienen prioridad
   */
  calculatePaymentPlan(
    debts: Debt[],
    method: "bola-de-nieve" | "avalancha",
    monthlyAvailable: number,
    currentDate: string,
  ): MonthlyPayment[] {
    // Si no hay fondos suficientes, no se calcula el plan
    if (monthlyAvailable <= 0) {
      return []
    }

    // Prepara las deudas para el cálculo
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

    // Ordena las deudas vencidas según el método seleccionado
    const sortOverdueDebts = (debts: typeof currentDebts) => {
      if (method === "bola-de-nieve") {
        return debts.sort((a, b) => a.balance - b.balance) // Menor balance primero
      } else {
        return debts.sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0)) // Mayor interés primero
      }
    }

    // Continúa hasta que todas las deudas estén pagadas
    while (currentDebts.some((debt) => debt.balance > 0)) {
      month++

      // Avanza un mes en la fecha
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

      // Calcula intereses y actualiza saldos
      currentDebts = currentDebts.map((debt) => {
        let interest = 0

        // Calcula intereses según el método de amortización
        if (debt.balance > 0) {
          if (debt.method === "frances") {
            interest = debt.balance * debt.interestRate
          }
          // Para método "ninguno" u otro, no se calcula interés adicional
        }

        // Guarda información sobre intereses pagados
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

      // Primero paga deudas vencidas
      const overdueDebts = currentDebts.filter((debt) => debt.isOverdue && debt.balance > 0)

      if (overdueDebts.length > 0) {
        // Ordena deudas vencidas según el método
        const sortedOverdueDebts = sortOverdueDebts(overdueDebts)

        monthData.extraDetails.explanation = `Este mes hay ${overdueDebts.length} deuda(s) vencida(s). Se priorizan según el método ${method === "bola-de-nieve" ? "bola de nieve" : "avalancha"}.`
        monthData.extraDetails.focusDebt = sortedOverdueDebts[0].name

        // Primero paga los mínimos de todas las deudas
        let minimumPayments = 0
        currentDebts.forEach((debt) => {
          if (debt.balance > 0) {
            const payment = Math.min(debt.minimumPayment, debt.balance)
            minimumPayments += payment
            debt.balance -= payment

            const interestPortion = monthData.extraDetails.interestPaid.find((i) => i.name === debt.name)
            const interestAmount = interestPortion ? Number.parseFloat(interestPortion.amount) : 0

            monthData.payments.push({
              name: debt.name,
              amount: payment.toFixed(2),
              type: debt.isOverdue ? "vencida" : "mínimo",
              interestAmount: interestAmount.toFixed(2),
            })
          }
        })

        // Calcula el dinero extra disponible después de pagar todos los mínimos
        availableFunds = totalMonthlyAvailable - minimumPayments
        monthData.extraDetails.availableAfterMinimums = availableFunds

        // Aplica el dinero extra solo a la deuda vencida priorizada
        if (availableFunds > 0) {
          const priorityDebt = currentDebts.find((d) => d.name === sortedOverdueDebts[0].name)!
          if (priorityDebt && priorityDebt.balance > 0) {
            const extraPayment = Math.min(availableFunds, priorityDebt.balance)
            
            if (extraPayment > 0) {
              priorityDebt.balance -= extraPayment

              // Actualiza el pago existente para la deuda priorizada
              const paymentIndex = monthData.payments.findIndex((p) => p.name === priorityDebt.name)
              if (paymentIndex !== -1) {
                const currentPayment = Number.parseFloat(monthData.payments[paymentIndex].amount)
                monthData.payments[paymentIndex].amount = (currentPayment + extraPayment).toFixed(2)
                monthData.payments[paymentIndex].type = "prioritario"

                monthData.extraDetails.extraPayment = {
                  name: priorityDebt.name,
                  amount: extraPayment.toFixed(2),
                }
              }
            }
          }
        }
      } else {
        // Método bola de nieve o avalancha
        // Ordena las deudas según el método seleccionado
        const sortedDebts = [...currentDebts]
          .filter((debt) => debt.balance > 0)
          .sort((a, b) => {
            if (method === "bola-de-nieve") {
              return a.balance - b.balance // Menor saldo primero
            } else {
              return (b.interestRate || 0) - (a.interestRate || 0) // Mayor interés primero
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

        // Paga los mínimos de todas las deudas
        currentDebts.forEach((debt) => {
          if (debt.balance > 0) {
            const payment = Math.min(debt.minimumPayment, debt.balance)
            debt.balance -= payment
            availableFunds -= payment

            // Calcula cuánto del pago es interés
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

        // Paga extra a la deuda priorizada
        if (sortedDebts.length > 0 && availableFunds > 0) {
          const priorityDebt = currentDebts.find((d) => d.name === sortedDebts[0].name)!
          const extraPayment = Math.min(availableFunds, priorityDebt.balance)

          if (extraPayment > 0) {
            priorityDebt.balance -= extraPayment

            // Actualiza el pago en monthData.payments
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

      // Registra los saldos restantes de cada deuda
      currentDebts.forEach((debt) => {
        monthData.remainingBalances.push({
          name: debt.name,
          amount: debt.balance.toFixed(2),
        })
      })

      monthlyPayments.push(monthData)

      // Evita bucles infinitos si algo sale mal
      if (month > 120) break
    }

    return monthlyPayments
  }

  /**
   * Analiza el plan de pagos para determinar en qué mes
   * se terminará de pagar cada una de las deudas.
   */
  findDebtCompletionDates(paymentPlan: MonthlyPayment[], processedDebts: Debt[]): Record<string, DebtCompletionDate> {
    const dates: Record<string, DebtCompletionDate> = {}
    processedDebts.forEach((debt) => {
      // Busca el primer mes donde el saldo de la deuda es 0
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

  /**
   * Prepara los datos para la gráfica de líneas que muestra
   * cómo van disminuyendo los saldos mes a mes.
   */
  calculateChartData(paymentPlan: MonthlyPayment[]): any[] {
    return paymentPlan.map((month) => {
      const data: any = { month: month.date }
      month.remainingBalances.forEach((balance) => {
        data[balance.name] = Number.parseFloat(balance.amount)
      })
      return data
    })
  }

  /**
   * Prepara los datos para el gráfico de torta que muestra
   * la proporción de cada deuda respecto al total.
   */
  calculatePieData(processedDebts: Debt[]): any[] {
    return processedDebts.map((debt) => ({
      name: debt.name,
      value: debt.remainingAmount,
      interestRate: debt.interest_rate ? Number.parseFloat(debt.interest_rate) : 0,
    }))
  }

  /**
   * Suma todos los intereses que se pagarán durante
   * la ejecución del plan de pagos.
   */
  calculateTotalInterestPaid(paymentPlan: MonthlyPayment[]): number {
    return paymentPlan.reduce((total, month) => {
      return total + month.extraDetails.totalInterest
    }, 0)
  }

  /**
   * Calcula el monto total que se pagará sumando:
   * - Capital original de todas las deudas
   * - Intereses generados durante el plan
   */
  calculateTotalPaid(paymentPlan: MonthlyPayment[]): number {
    return paymentPlan.reduce((total, month) => {
      return total + month.payments.reduce((sum, payment) => sum + Number.parseFloat(payment.amount), 0)
    }, 0)
  }

  /**
   * Suma el monto inicial de todas las deudas
   * sin considerar intereses futuros.
   */
  calculateOriginalDebtTotal(processedDebts: Debt[]): number {
    return processedDebts.reduce((total, debt) => total + Number.parseFloat(debt.amount), 0)
  }
}
