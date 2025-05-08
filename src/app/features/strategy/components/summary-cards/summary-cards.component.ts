import { Component, computed, effect, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DebtDataService } from "../../services/debt-data.service"

@Component({
  selector: "app-summary-cards",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./summary-cards.component.html",
})
export class SummaryCardsComponent {
  private debtDataService = inject(DebtDataService);

  // Access signals directly from the service
  debtData = this.debtDataService.debtData;
  monthlyAvailable = this.debtDataService.monthlyAvailable;
  totalMinimumPayment = this.debtDataService.totalMinimumPayment;
  processedDebts = this.debtDataService.processedDebts;
  compareMethod = this.debtDataService.compareMethod;


  // Helper signals (convertidos de getters a señales computadas)
  incomeTotal = computed(() => 
    this.debtData()?.recurringTransactions
      .filter((t) => t.type === "Ingreso")
      .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0
  );

  expensesTotal = computed(() => 
    this.debtData()?.recurringTransactions
      .filter((t) => t.type === "Gasto")
      .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0
  );

  originalDebtTotal = computed(() => 
    this.processedDebts().reduce((total, debt) => total + debt.remainingAmount, 0)
  );

  overdueDebtsCount = computed(() => 
    this.processedDebts().filter((d) => d.isOverdue).length
  );

  handleMethodChange(method: "bola-de-nieve" | "avalancha"): void {
    console.log('handleMethodChange', method);
    
    this.debtDataService.setMethod(method);
  }

  toggleCompareMethod(): void {
    this.debtDataService.toggleCompareMethod();
  }
}
