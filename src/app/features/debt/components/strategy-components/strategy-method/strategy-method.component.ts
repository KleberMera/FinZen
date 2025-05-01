import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarSelectedDebtsComponent } from '../sidebar-selected-debts/sidebar-selected-debts.component';
import { StrategyPlanComponent } from '../strategy-plan/strategy-plan.component';

@Component({
  selector: 'app-strategy-method',
  imports: [SidebarSelectedDebtsComponent, StrategyPlanComponent],
  templateUrl: './strategy-method.component.html',
  styleUrl: './strategy-method.component.scss',
})
export default class StrategyMethodComponent {
  // Inyectar ActivatedRoute para acceder a los query parameters
  method = input<string>('');
  readonly router = inject(Router);
  viewMethod = signal(true);

  // Para almacenar las selecciones
  selectedSalary = signal(false);
  selectedDebtIds = signal<number[]>([]);

  isSeletedDebtsSidebarOpen = signal(false);

  onSeletedDebtsClick() {
    console.log('onSeletedDebtsClick');
    this.isSeletedDebtsSidebarOpen.update((value) => !value);
  }

  closeSeletedDebtsSidebar() {
    console.log('closeSeletedDebtsSidebar');
    this.isSeletedDebtsSidebarOpen.set(false);
  }

  goToStrategy(): void {
    this.router.navigate(['home/deudas-estrategia/elegir']);
  }

  handleSelectedItems(selection: {
    salary: boolean;
    debtIds: number[];
    method: string;
  }) {
    this.viewMethod.set(false);
    console.log('Elementos seleccionados:', selection);
    this.selectedSalary.set(selection.salary);
    this.selectedDebtIds.set(selection.debtIds);

  }
}
