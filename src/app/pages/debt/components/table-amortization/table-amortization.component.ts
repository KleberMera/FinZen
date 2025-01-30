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
}
