import { Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { SnowballService } from '../../../services/snowball.service';
import { StrategyMethod } from '@models/debt';
import { SalarySeletedComponent } from './components/salary-seleted/salary-seleted.component';
import { SectionDebtsComponent } from './components/section-debts/section-debts.component';

@Component({
  selector: 'app-sidebar-selected-debts',
  imports: [SalarySeletedComponent, SectionDebtsComponent],
  templateUrl: './sidebar-selected-debts.component.html',
  styleUrl: './sidebar-selected-debts.component.scss',
})
export class SidebarSelectedDebtsComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);
  readonly salaryComponent = viewChild(SalarySeletedComponent);
  readonly debtComponent = viewChild(SectionDebtsComponent);
  method = input.required<string>();

  closeSeletedDebtsSidebar = output<void>();
  selectedItems = output<StrategyMethod>();

  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));


  close() {
    this.closeSeletedDebtsSidebar.emit();
  }

  applySelection() {
    const selectedDebts =
      this.debtComponent()
        ?.debts.value()
        ?.data?.filter((debt) =>
          this.debtComponent()?.selectedDebtIds().includes(debt.id!)
        ) || [];

    const selectionData: StrategyMethod = {
      salary: this.salaryComponent()!.includeSalary(),
      method: this.method(),
      debts: selectedDebts, // Enviamos los objetos completos de deuda en lugar de solo IDs
      userId: this.seletdUserId(),
      ...(this.salaryComponent()!.includeSalary() && {
        salaryData: this.salaryComponent()!.salary.value()?.data?.salary_amount,
      }),
    };

    this.selectedItems.emit(selectionData);
    this.close();
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

    return total.toFixed(2);
  }

  selectedDebtCount = computed(
    () => this.debtComponent()?.selectedDebtIds().length
  );
}
