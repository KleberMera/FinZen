import { Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';

import { StrategyMethod } from '@models/debt';
import { SalarySeletedComponent } from './components/salary-seleted/salary-seleted.component';
import { SectionDebtsComponent } from './components/section-debts/section-debts.component';
import { SectionRecurringComponent } from "./components/section-recurring/section-recurring.component";
import { SnowballService } from '../../../debt/services/snowball.service';
import { DebtData } from '../../types/debt-types';

@Component({
  selector: 'app-sidebar-selected-debts',
  imports: [SalarySeletedComponent, SectionDebtsComponent, SectionRecurringComponent],
  templateUrl: './sidebar-selected-debts.component.html',
  styleUrl: './sidebar-selected-debts.component.scss',
})
export default class SidebarSelectedDebtsComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);
  readonly salaryComponent = viewChild(SalarySeletedComponent);
  readonly debtComponent = viewChild(SectionDebtsComponent);
  readonly recurringComponent = viewChild(SectionRecurringComponent);


  selectedItems = output<DebtData>();

  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));



  applySelection() {
    // Filtrar las deudas por los IDs seleccionados
    const selectedDebts =
      this.debtComponent()
        ?.debts.value()
        ?.data?.filter((debt) =>
          this.debtComponent()?.selectedDebtIds().includes(debt.id!)
        ) || [];
    
    // Filtrar las transacciones recurrentes por los IDs seleccionados
    const selectedTransactions = 
      this.recurringComponent()!.recurringTransactions.value()!
        .filter(transaction => 
          this.recurringComponent()?.selectedTransactionIds().includes(transaction.id!)
        )
        .map(transaction => ({
          name: transaction.name,
          amount: Number(transaction.amount),
          type: transaction.category?.type as "Ingreso" | "Gasto"
        }));
  
    const selectionData: DebtData = {
      salary: this.salaryComponent()!.includeSalary(),
      method: 'bola-de-nieve',
      currentDate: format(new Date(), 'YYYY-MM-DD', 'es'),
      debts: selectedDebts,
      userId: this.seletdUserId(),
      salaryData: this.salaryComponent()!.includeSalary() 
        ? (this.salaryComponent()!.salary.value()?.data?.salary_amount ?? 0)
        : 0,
      recurringTransactions: selectedTransactions,
    };
  
    this.selectedItems.emit(selectionData);
    console.log('Elementos seleccionados:', selectionData);
  }

  hasSelection = computed(
    () =>
      this.salaryComponent()!.includeSalary() ||
      this.debtComponent()!.selectedDebtIds().length >= 2
  );

  calculateTotal(): string {
    let total = 0;
    const includeSalary = this.salaryComponent()!.includeSalary(); 
    const salary = this.salaryComponent()!.salary.value()?.data?.salary_amount;

    // Añadir el sueldo si está seleccionado
    if (includeSalary && salary) {
      total += parseFloat(String(salary || 0));
    }

    // Añadir las deudas seleccionadas
    if (this.debtComponent()?.debts.value()?.data) {
      this.debtComponent()
        ?.debts.value()
        ?.data!.forEach((debt) => {
          if (this.debtComponent()?.isDebtSelected(debt.id!)) {
            total += parseFloat(String(debt.amount));
          }
        });
    }

    // Añadir los montos de las transacciones recurrentes
    if (this.recurringComponent()?.recurringTransactions.value()) {
      this.recurringComponent()
        ?.recurringTransactions.value()
        ?.forEach((transaction) => {
          if (this.recurringComponent()?.isTransactionSelected(transaction.id!)) {
            total += parseFloat(String(transaction.amount));
          }
        });
    }

    return total.toFixed(2);
  }

  selectedDebtCount = computed(
    () => this.debtComponent()?.selectedDebtIds().length
  );
}
