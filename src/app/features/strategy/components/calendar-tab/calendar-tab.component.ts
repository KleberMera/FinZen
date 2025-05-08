import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DebtDataService } from "../../services/debt-data.service"
import { DebtCalculatorService } from "../../services/debt-calculator.service"

@Component({
  selector: "app-calendar-tab",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./calendar-tab.component.html",
})
export class CalendarTabComponent {
  private debtDataService = inject(DebtDataService)
  private calculatorService = inject(DebtCalculatorService)

  // Access signals directly from the service
  debtData = this.debtDataService.debtData
  paymentPlan = this.debtDataService.paymentPlan
  processedDebts = this.debtDataService.processedDebts

  get debtCompletionDates() {
    return this.calculatorService.findDebtCompletionDates(this.paymentPlan(), this.processedDebts())
  }
}
