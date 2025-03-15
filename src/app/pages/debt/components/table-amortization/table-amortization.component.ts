import { Component, computed, inject, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Debt } from '@models/debt';
import { SidebarDebDetailsComponent } from '../sidebar-deb-details/sidebar-deb-details.component';

@Component({
  selector: 'app-table-amortization',
  imports: [CurrencyPipe, DatePipe, SidebarDebDetailsComponent],
  templateUrl: './table-amortization.component.html',
  styleUrl: './table-amortization.component.scss',
})
export class TableAmortizationComponent {
  readonly totalMonths = signal<number>(0);
  readonly sortOrderStatus = signal<'asc' | 'desc' | null>(null);
  readonly formData = input<FormGroup>();
  readonly filters = input<Debt[]>();

  protected readonly datos = computed(() => {
    const rawData = this.filters()
      ? this.filters()![0].amortizations
      : this.formData()?.get('amortizations')?.value || [];

    return [...rawData].sort((a, b) => {
      // Orden principal por número de mes
      const monthOrder = a.number_months - b.number_months;

      // Si hay sorting por estado aplicado
      if (this.sortOrderStatus()) {
        const statusOrder =
          a.status === b.status ? 0 : a.status === 'Pendiente' ? -1 : 1;
        // Aplica dirección del sort
        const statusMultiplier = this.sortOrderStatus() === 'asc' ? 1 : -1;

        // Prioriza el estado si hay sort activo
        return statusOrder !== 0 ? statusOrder * statusMultiplier : monthOrder;
      }

      // Orden por defecto (mes)
      return monthOrder;
    });
  });

  toggleStatusSort() {
    this.sortOrderStatus.update((current) =>
      current === null ? 'asc' : current === 'asc' ? 'desc' : null
    );
  }

  selectedDebt = signal<Debt | null>(null);
  isSidebarOpen = signal(false);

  ondebtClick(debt: Debt): void {
    console.log('Recibido', debt);
    this.selectedDebt.set(debt);
    this.isSidebarOpen.set(true); // Abre el sidebar
  }

  // Método para cerrar el sidebar
  closeUserSidebar(): void {
    console.log('Cerrando sidebar...');
    this.isSidebarOpen.set(false); // Cierra el sidebar
    this.selectedDebt.set(null); // Limpia la transacción seleccionada
  }
}
