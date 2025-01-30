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

  protected onCheckboxChange(id: number) {
    const currentIds = this.selectedIds();
    if (currentIds.includes(id)) {
      this.selectedIds.set(currentIds.filter(item => item !== id));
    } else {
      this.selectedIds.set([...currentIds, id]);
    }
  }
}
