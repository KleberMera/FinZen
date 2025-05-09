import { Component, inject } from '@angular/core';
import { DebtDataService } from '../../services/debt-data.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-debt-details',
  imports: [NgClass],
  templateUrl: './debt-details.component.html',
  styleUrl: './debt-details.component.scss'
})
export class DebtDetailsComponent {
  private debtDataService = inject(DebtDataService)

  // Access signals directly from the service
  processedDebts = this.debtDataService.processedDebts

  // Helper method to calculate total remaining amount
  get totalRemainingAmount(): number {
    return this.processedDebts().reduce((total, debt) => total + debt.remainingAmount, 0)
  }

  // Helper method to calculate total paid amount
  get totalPaidAmount(): number {
    return this.processedDebts().reduce((total, debt) => total + debt.totalPaidAmount, 0)
  }

  // Helper method to calculate total original amount
  get totalOriginalAmount(): number {
    return this.processedDebts().reduce((total, debt) => total + Number.parseFloat(debt.amount), 0)
  }

  // Helper method to calculate total remaining installments
  get totalRemainingInstallments(): number {
    return this.processedDebts().reduce((total, debt) => total + debt.remainingInstallments, 0)
  }

  // Helper method to calculate total paid installments
  get totalPaidInstallments(): number {
    return this.processedDebts().reduce((total, debt) => total + debt.paidInstallmentsCount, 0)
  }
}
