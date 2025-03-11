import {Component, computed, effect, inject, input, signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MethodService } from '../../services/method.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Debt } from '@models/debt';

@Component({
  selector: 'app-table-amortization',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './table-amortization.component.html',
  styleUrl: './table-amortization.component.scss',
})
export class TableAmortizationComponent {
  readonly totalMonths = signal<number>(0);
  readonly sortOrderStatus = signal<'asc' | 'desc' | null>(null);
  readonly formData = input<FormGroup>();
  readonly filters = input<Debt[]>();

  private readonly _methodService = inject(MethodService);

  protected readonly datos = computed(() => {
    const rawData = this.filters() 
      ? this.filters()![0].amortizations 
      : this.formData()?.get('amortizations')?.value || [];
  
    return [...rawData].sort((a, b) => {
      // Orden principal por número de mes
      const monthOrder = a.number_months - b.number_months;
      
      // Si hay sorting por estado aplicado
      if (this.sortOrderStatus()) {
        const statusOrder = a.status === b.status ? 0 : a.status === 'Pendiente' ? -1 : 1;
        // Aplica dirección del sort
        const statusMultiplier = this.sortOrderStatus() === 'asc' ? 1 : -1;
        
        // Prioriza el estado si hay sort activo
        return statusOrder !== 0 ? statusOrder * statusMultiplier : monthOrder;
      }
      
      // Orden por defecto (mes)
      return monthOrder;
    });
  });

  constructor() {
    effect(() => {
      if (this.formData()) {
        console.log(this.formData()?.value);
        
        const method = this.formData()!.get('method')?.value;
        if (method === 'frances') {
          this._methodService.calculateFrenchAmortization(this.formData()!);
          this.totalMonths.set(this._methodService.totalMonths(this.formData()!));
        } if(method === 'ninguno'){
        //  this._methodService.calculateWithoutAmortization(this.formData()!);
          this.totalMonths.set(this._methodService.totalMonths(this.formData()!));
        } else {
          this._methodService.calculateGermanAmortization(this.formData()!);
          this.totalMonths.set(this._methodService.totalMonths(this.formData()!));
        }
      } else {
        const data = this.filters()![0].amortizations;
        this.totalMonths.set(data.length);
      }
    });
  }

  toggleStatusSort() {
    this.sortOrderStatus.update(current => 
      current === null ? 'asc' : 
      current === 'asc' ? 'desc' : null
    );
  }
}
