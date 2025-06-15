import { Component, inject } from "@angular/core"
import { CommonModule, NgClass } from "@angular/common"
import { DebtDataService } from "../../services/debt-data.service"
import { MonthlyPayment } from "../../types/debt-types"

@Component({
  selector: "app-payment-table-tab",
  standalone: true,
  imports: [],
  templateUrl: "./payment-table-tab.component.html",
})
export class PaymentTableTabComponent {
  private debtDataService = inject(DebtDataService)

  // Access signals directly from the service
  paymentPlan = this.debtDataService.paymentPlan
  processedDebts = this.debtDataService.processedDebts

  // Helper methods to find payments and balances
  findPayment(month: MonthlyPayment, debtName: string) {
    return month.payments.find((p) => p.name === debtName)
  }

  findBalance(month: MonthlyPayment, debtName: string) {
    return month.remainingBalances.find((b) => b.name === debtName)
  }

  // Helper method to determine if payment should be highlighted
  isHighlightedPayment(paymentType: string | undefined): boolean {
    return paymentType === "prioritario" || paymentType === "bola de nieve" || paymentType === "avalancha"
  }
}

