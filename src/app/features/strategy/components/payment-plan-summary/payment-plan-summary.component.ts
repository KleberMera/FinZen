import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DebtDataService } from "../../services/debt-data.service"
import { DebtCalculatorService } from "../../services/debt-calculator.service"

@Component({
  selector: "app-payment-plan-summary",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./payment-plan-summary.component.html",
})
export class PaymentPlanSummaryComponent {
  private debtDataService = inject(DebtDataService)
  private calculatorService = inject(DebtCalculatorService)

  // Access signals directly from the service
  debtData = this.debtDataService.debtData
  paymentPlan = this.debtDataService.paymentPlan
  processedDebts = this.debtDataService.processedDebts
  compareMethod = this.debtDataService.compareMethod
  comparisonData = this.debtDataService.comparisonData

  // Computed values
  get originalDebtTotal(): number {
    return this.calculatorService.calculateOriginalDebtTotal(this.processedDebts())
  }

  get totalPaid(): number {
    return this.calculatorService.calculateTotalPaid(this.paymentPlan())
  }

  get totalInterestPaid(): number {
    return this.calculatorService.calculateTotalInterestPaid(this.paymentPlan())
  }
}
