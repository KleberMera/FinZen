import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarSelectedDebtsComponent } from '../sidebar-selected-debts/sidebar-selected-debts.component';

@Component({
  selector: 'app-strategy-method',
  imports: [SidebarSelectedDebtsComponent],
  templateUrl: './strategy-method.component.html',
  styleUrl: './strategy-method.component.scss',
})
export default class StrategyMethodComponent {
  // Inyectar ActivatedRoute para acceder a los query parameters
  metodo = input<string>('');
  readonly router = inject(Router);

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
}
