import { Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { SnowballService } from '../../../services/snowball.service';
import { StrategyMethod } from '@models/debt';
import { SalarySeletedComponent } from './components/salary-seleted/salary-seleted.component';
import { SectionDebtsComponent } from './components/section-debts/section-debts.component';
import { SectionRecurringComponent } from "./components/section-recurring/section-recurring.component";

@Component({
  selector: 'app-sidebar-selected-debts',
  imports: [SalarySeletedComponent, SectionDebtsComponent, SectionRecurringComponent],
  templateUrl: './sidebar-selected-debts.component.html',
  styleUrl: './sidebar-selected-debts.component.scss',
})
export class SidebarSelectedDebtsComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);
  readonly salaryComponent = viewChild(SalarySeletedComponent);
  readonly debtComponent = viewChild(SectionDebtsComponent);
  readonly recurringComponent = viewChild(SectionRecurringComponent);


  closeSeletedDebtsSidebar = output<void>();
  selectedItems = output<StrategyMethod>();

  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));



  applySelection() {
    const selectedDebts =
      this.debtComponent()
        ?.debts.value()
        ?.data?.filter((debt) =>
          this.debtComponent()?.selectedDebtIds().includes(debt.id!)
        ) || [];

    const selectionData: StrategyMethod = {
      salary: this.salaryComponent()!.includeSalary(),
      method: 'bola-de-nieve',
      currentDate: format(new Date(), 'YYYY-MM-DD', 'es'),
      debts: selectedDebts,
      userId: this.seletdUserId(),
      ...(this.salaryComponent()!.includeSalary() && {
      salaryData: this.salaryComponent()!.salary.value()?.data?.salary_amount,
      }),
      recurringTransactions: this.recurringComponent()!.recurringTransactions.value()!.map(transaction => ({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.category?.type
      })) ,
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
