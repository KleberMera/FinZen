import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../shared/services/storage.service';
import { format } from '@formkit/tempo';
import { DebtData } from '../../types/debt-types';
import { SalarySeletedComponent } from './components/salary-seleted/salary-seleted.component';
import { SectionDebtsComponent } from './components/section-debts/section-debts.component';
import { SectionRecurringComponent } from "./components/section-recurring/section-recurring.component";
import { MethodPlanService } from '../../../debt/services/method-plan.service';
import StrategyStateService from '../../services/strategy-state.service';

@Component({
  selector: 'app-sidebar-selected-debts',
  standalone: true,
  templateUrl: './sidebar-selected-debts.component.html',
  styleUrls: ['./sidebar-selected-debts.component.scss'],
  imports: [SalarySeletedComponent, SectionDebtsComponent, SectionRecurringComponent]
})
export default class SidebarSelectedDebtsComponent {
  private router = inject(Router);
  private strategyState = inject(StrategyStateService);
  protected readonly _storage = inject(StorageService);
  protected readonly _methodPlanService = inject(MethodPlanService);

  readonly salaryComponent = viewChild(SalarySeletedComponent);
  readonly debtComponent = viewChild(SectionDebtsComponent);
  readonly recurringComponent = viewChild(SectionRecurringComponent);



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
  
    // Guardar los datos en el servicio de estado y navegar al plan
    this.strategyState.setSelectedData(selectionData);
    this.router.navigate(['home/plan']);
    console.log('Elementos seleccionados:', selectionData);
  }

  hasSelection = computed(
    () =>
      this.salaryComponent()!.includeSalary() &&
      (this.debtComponent()!.selectedDebtIds().length > 0 ||
       this.recurringComponent()!.selectedTransactionIds().length > 0)
  );

  calculateDebtTotal(): string {
    let total = 0;
    
    // Calcular el total de deudas seleccionadas
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

  calculateDebtTotalAmortization(): string {
    let total = 0;
    
    // Calcular el total de cuotas de amortizaciones de deudas seleccionadas
    if (this.debtComponent()?.debts.value()?.data) {
      this.debtComponent()
        ?.debts.value()
        ?.data!.forEach((debt) => {
          if (this.debtComponent()?.isDebtSelected(debt.id!) && 
              debt.amortizations?.length > 0) {
            
            // Sumar todas las cuotas de las amortizaciones de esta deuda
            debt.amortizations.forEach((amortization) => {
              if (amortization.quota) {
                total += parseFloat(String(amortization.quota));
              }
            });
          }
        });
    }

    return total.toFixed(2);
  }

  calculateDebtTotalAmortizationPending(): string {
    let total = 0;
    
    // Calcular el total de cuotas de amortizaciones de deudas seleccionadas
    if (this.debtComponent()?.debts.value()?.data) {
      this.debtComponent()
        ?.debts.value()
        ?.data!.forEach((debt) => {
          if (this.debtComponent()?.isDebtSelected(debt.id!) && 
              debt.amortizations?.length > 0) {
            
            // Sumar solo las cuotas pendientes de las amortizaciones de esta deuda
            debt.amortizations.forEach((amortization) => {
              if (amortization.quota && amortization.status === 'Pendiente') {
                total += parseFloat(String(amortization.quota));
              }
            });
          }
        });
    }

    return total.toFixed(2);
  }

  calculateRecurringIncomeTotal(): string {
    let total = 0;
    
    // Calcular el total de ingresos recurrentes seleccionados
    if (this.recurringComponent()?.recurringTransactions.value()) {
      this.recurringComponent()
        ?.recurringTransactions.value()
        ?.forEach((transaction) => {
          if (this.recurringComponent()?.isTransactionSelected(transaction.id!) && 
              transaction.category?.type === 'Ingreso') {
            total += parseFloat(String(transaction.amount));
          }
        });
    }

    return total.toFixed(2);
  }

  calculateRecurringExpenseTotal(): string {
    let total = 0;
    
    // Calcular el total de gastos recurrentes seleccionados
    if (this.recurringComponent()?.recurringTransactions.value()) {
      this.recurringComponent()
        ?.recurringTransactions.value()
        ?.forEach((transaction) => {
          if (this.recurringComponent()?.isTransactionSelected(transaction.id!) && 
              transaction.category?.type === 'Gasto') {
            total += parseFloat(String(transaction.amount));
          }
        });
    }

    return total.toFixed(2);
  }

  calculateTotal(): string {
    let total = 0;
    const includeSalary = this.salaryComponent()!.includeSalary(); 
    const salary = this.salaryComponent()!.salary.value()?.data?.salary_amount;

    // Añadir el sueldo si está seleccionado
    if (includeSalary && salary) {
      total += parseFloat(String(salary || 0));
    }

    // Añadir las deudas seleccionadas
    total += parseFloat(this.calculateDebtTotal());

    // Añadir los montos de las transacciones recurrentes (ingresos y gastos)
    total += parseFloat(this.calculateRecurringIncomeTotal());
    total += parseFloat(this.calculateRecurringExpenseTotal());

    return total.toFixed(2);
  }

  selectedDebtCount = computed(
    () => this.debtComponent()?.selectedDebtIds().length
  );
}
