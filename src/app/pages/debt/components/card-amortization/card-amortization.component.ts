import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Debt } from '@models/debt';
import { MethodService } from '../../services/method.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SidebarDebDetailsComponent } from "../sidebar-deb-details/sidebar-deb-details.component";
import { Amortization } from '@models/amortization';

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
  selectedAmortization = signal<Amortization | null>(null);
  debtId = signal<number>(0);
  updateSuccess = output<void>();
  private readonly _methodService = inject(MethodService);
  isSidebarOpen = signal(false);

  ondebtClick(amortization: Amortization): void {
    console.log('Recibido', amortization);
    const debtId = this.filters() ? this.filters()![0].id : this.formData()?.get('id')?.value;
    this.debtId.set(debtId);
    this.selectedAmortization.set(amortization);
    this.isSidebarOpen.set(true); // Abre el sidebar
  }

  // Método para manejar el evento de actualización del sidebar
  onSidebarUpdateSuccess(): void {
    this.updateSuccess.emit(); // Propaga el evento hacia ListDebtComponent
  }


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
        this.totalMonths.set(this._methodService.totalMonths(this.formData()!));
      } else {
        const data = this.filters()![0].amortizations;
        this.totalMonths.set(data.length);
      }
    });
  }

  protected calculateProgress(
    currentMonth: number,
    totalMonths: number
  ): string {
    const circumference = 2 * Math.PI * 35; // radio = 35
    const percent = currentMonth / totalMonths;
    const offset = circumference * (1 - percent);
    return `${circumference} ${offset}`;
  }

  protected calculateTotal(field: 'quota' | 'interest' | 'amortized'): number {
    return this.datos().reduce((sum: any, item: any) => sum + item[field], 0);
  }


  // Método para cerrar el sidebar
  closeUserSidebar(): void {
    this.isSidebarOpen.set(false); // Cierra el sidebar
    this.selectedAmortization.set(null); // Limpia la transacción seleccionada
    this.debtId.set(0);
  }
}
