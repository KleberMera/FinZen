import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { Amortization } from '@models/amortization';




@Component({
  selector: 'app-amortization-view',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './amortization-view.component.html',
  styleUrl: './amortization-view.component.scss'
})
export class AmortizationViewComponent {
  debtId = input.required<number>();
  debtName = input.required<string>();
  debtDescription = input<string>('');
  amortizations = input.required<Amortization[]>();
  
  onBack = output<void>();
  onUpdateStatus = output<{debtId: number, amortizationIds: number[]}>();

  selectedIds = signal<number[]>([]);
  statusSortDirection = signal<'asc' | 'desc'>('asc');
  protected onCheckboxChange(id: number) {
    const currentIds = this.selectedIds();
    if (currentIds.includes(id)) {
      this.selectedIds.set(currentIds.filter(item => item !== id));
    } else {
      this.selectedIds.set([...currentIds, id]);
    }
  }

  protected sortedAmortizations() {
    return [...this.amortizations()].sort((a, b) => {
      // Primero ordenamos por number_months
      const monthsOrder = a.number_months - b.number_months;
      
      // Si hay un ordenamiento por estado activo
      const statusOrder = this.statusSortDirection() === 'asc' 
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
      
      return statusOrder || monthsOrder;
    });
  }

  protected toggleStatusSort() {
    this.statusSortDirection.update(current => 
      current === 'asc' ? 'desc' : 'asc'
    );
  }
}
