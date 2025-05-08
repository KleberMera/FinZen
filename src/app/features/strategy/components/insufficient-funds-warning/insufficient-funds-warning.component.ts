import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DebtDataService } from "../../services/debt-data.service"

@Component({
  selector: "app-insufficient-funds-warning",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./insufficient-funds-warning.component.html",
})
export class InsufficientFundsWarningComponent {
  private debtDataService = inject(DebtDataService)

  // Access signals directly from the service
  monthlyAvailable = this.debtDataService.monthlyAvailable
  totalMinimumPayment = this.debtDataService.totalMinimumPayment
  deficit = this.debtDataService.deficit
}
