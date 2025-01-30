import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Debt } from '@models/debt';
import { MethodService } from '../../services/method.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-amortization',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './card-amortization.component.html',
  styleUrl: './card-amortization.component.scss'
})
export class CardAmortizationComponent {
 readonly totalMonths = signal<number>(0);
  readonly formData = input<FormGroup>();
  readonly filters = input<Debt[]>();

  private readonly _methodService = inject(MethodService);

  protected readonly datos = computed(() => {
    if (this.filters()) {
      return this.filters()![0].amortizations;
    }

    return this.formData()?.get('amortizations')?.value || [];
  });
  
 constructor() {
    effect(() => {
      if (this.formData()) {
        const method = this.formData()!.get('method')?.value;
        if (method === 'frances') {
          this._methodService.calculateFrenchAmortization(this.formData()!);
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

  protected calculateProgress(currentMonth: number, totalMonths: number): string {
    console.log(this.datos().length);
    
    const circumference = 2 * Math.PI * 35; // radio = 35
    const percent = currentMonth / totalMonths;
    const offset = circumference * (1 - percent);
    return `${circumference} ${offset}`;
  }

  protected calculateTotal(field: 'quota' | 'interest' | 'amortized'): number {
    return this.datos().reduce((sum: any, item: any) => sum + item[field], 0);
  }
}
