import { Component, computed, inject, input, signal } from '@angular/core';
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


  protected calculateProgress(currentMonth: number, totalMonths: number): string {
    const circumference = 2 * Math.PI * 35; // radio = 35
    const percent = currentMonth / totalMonths;
    const offset = circumference * (1 - percent);
    return `${circumference} ${offset}`;
  }

  protected calculateTotal(field: 'quota' | 'interest' | 'amortized'): number {
    return this.datos().reduce((sum: any, item: any) => sum + item[field], 0);
  }
}
