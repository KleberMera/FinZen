import { inject, Injectable, signal } from "@angular/core"
import type { DebtData, Debt, MonthlyPayment, ComparisonData } from "../types/debt-types"
import { DebtCalculatorService } from "./debt-calculator.service"

@Injectable({
  providedIn: "root",
})
export class DebtDataService {
  protected readonly calculator = inject(DebtCalculatorService)
 // Signals for reactive state
 debtData = signal<DebtData>({} as DebtData);


 setData(data: DebtData): void {
   // Update the signal with the provided data
   this.debtData.set(data);
   console.log('DebtDataService.setData', data);
   
   // Process the data
   this.initializeData();
 }



  private initializeData(): void {
    // Calculate monthly available
    this.updateMonthlyAvailable()

    // Process debts
    this.updateProcessedDebts()

    // Calculate payment plan
    this.updatePaymentPlan()
  }


  processedDebts = signal<Debt[]>([])
  monthlyAvailable = signal<number>(0)
  totalMinimumPayment = signal<number>(0)
  insufficientFunds = signal<boolean>(false)
  deficit = signal<number>(0)
  paymentPlan = signal<MonthlyPayment[]>([])
  compareMethod = signal<boolean>(false)
  comparisonData = signal<ComparisonData | null>(null)



  updateMonthlyAvailable(): void {
    const available = this.calculator.calculateMonthlyAvailable(this.debtData())
    this.monthlyAvailable.set(available)

    // Check if there are sufficient funds
    this.checkSufficientFunds()
  }

  updateProcessedDebts(): void {
    const processed = this.calculator.processDebts(this.debtData().debts, this.debtData().currentDate)
    this.processedDebts.set(processed)

    // Calculate total minimum payment
    const totalMinimum = processed.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0)
    this.totalMinimumPayment.set(totalMinimum)

    // Check if there are sufficient funds
    this.checkSufficientFunds()
  }

  private checkSufficientFunds(): void {
    if (this.monthlyAvailable() < this.totalMinimumPayment()) {
      this.insufficientFunds.set(true)
      this.deficit.set(this.totalMinimumPayment() - this.monthlyAvailable())
    } else {
      this.insufficientFunds.set(false)
      this.deficit.set(0)
    }
  }

  updatePaymentPlan(): void {
    if (this.processedDebts().length > 0 && !this.insufficientFunds()) {
      const plan = this.calculator.calculatePaymentPlan(
        this.processedDebts(),
        this.debtData().method,
        this.monthlyAvailable(),
        this.debtData().currentDate,
      )
      this.paymentPlan.set(plan)
    } else {
      this.paymentPlan.set([])
    }

    // Update comparison data if needed
    if (this.compareMethod()) {
      this.updateComparisonData()
    }
  }

  updateComparisonData(): void {
    if (this.compareMethod() && this.processedDebts().length > 0 && !this.insufficientFunds()) {
      const comparisonMethod = this.debtData().method === "bola-de-nieve" ? "avalancha" : "bola-de-nieve"
      const comparisonPlan = this.calculator.calculatePaymentPlan(
        this.processedDebts(),
        comparisonMethod,
        this.monthlyAvailable(),
        this.debtData().currentDate,
      )

      const comparison: ComparisonData = {
        method: comparisonMethod,
        months: comparisonPlan.length,
        totalInterest: comparisonPlan.reduce((sum, month) => sum + month.extraDetails.totalInterest, 0),
        lastDate: comparisonPlan[comparisonPlan.length - 1]?.date || "",
      }

      this.comparisonData.set(comparison)
    } else {
      this.comparisonData.set(null)
    }
  }

  setMethod(method: "bola-de-nieve" | "avalancha"): void {
    this.debtData.update((data) => ({ ...data, method }))
    this.updatePaymentPlan()
  }

  toggleCompareMethod(): void {
    this.compareMethod.update((value) => !value)
    if (this.compareMethod()) {
      this.updateComparisonData()
    } else {
      this.comparisonData.set(null)
    }
  }
}
