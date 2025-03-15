import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Debt } from '@models/debt';
import { MethodService } from '../../services/method.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SidebarDebDetailsComponent } from "../sidebar-deb-details/sidebar-deb-details.component";

@Component({
  selector: 'app-card-amortization',
  imports: [CurrencyPipe, DatePipe, SidebarDebDetailsComponent],
  templateUrl: './card-amortization.component.html',
  styleUrl: './card-amortization.component.scss',
})
export class CardAmortizationComponent {
  readonly totalMonths = signal<number>(0);
  readonly formData = input<FormGroup>();
  readonly filters = input<Debt[]>();

  private readonly _methodService = inject(MethodService);

  protected readonly datos = computed(() => {
    const rawData = this.filters()
      ? this.filters()![0].amortizations
      : this.formData()?.get('amortizations')?.value || [];

    // Ordenar por número de mes
    return [...rawData].sort((a, b) => a.number_months - b.number_months);
  });

  constructor() {
    effect(() => {
      if (this.formData()) {
        console.log('data');

        this.totalMonths.set(this._methodService.totalMonths(this.formData()!));
      } else {
        console.log('data2');

        const data = this.filters()![0].amortizations;
        this.totalMonths.set(data.length);
      }
    });
  }

  protected calculateProgress(
    currentMonth: number,
    totalMonths: number
  ): string {
    console.log(this.datos().length);

    const circumference = 2 * Math.PI * 35; // radio = 35
    const percent = currentMonth / totalMonths;
    const offset = circumference * (1 - percent);
    return `${circumference} ${offset}`;
  }

  protected calculateTotal(field: 'quota' | 'interest' | 'amortized'): number {
    return this.datos().reduce((sum: any, item: any) => sum + item[field], 0);
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
