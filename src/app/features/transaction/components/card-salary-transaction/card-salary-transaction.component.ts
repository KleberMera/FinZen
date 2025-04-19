import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { apiResponse } from '@models/apiResponse';
import { CurrencyPipe } from '@angular/common';
import { FinanceSummary } from '@models/finance';

@Component({
  selector: 'app-card-salary-transaction',
  imports: [CurrencyPipe],
  templateUrl: './card-salary-transaction.component.html',
  styleUrl: './card-salary-transaction.component.scss',
})
export class CardSalaryTransactionComponent {
  private readonly _storageService = inject(StorageService);
  private readonly _salaryService = inject(SalaryService);

  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );
  public readonly stateReset = signal(false);

  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = computed(() =>
    format(this.timeNow(), 'MMMM', this.lenguaje())
  );

  currentMonthNumber = computed(() =>
    format(this.timeNow(), 'M', this.lenguaje())
  );
  currenDate = computed(() =>
    format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje())
  );
  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  salaryData = rxResource<
    apiResponse<FinanceSummary>,
    { userId: number; currentMonth: number; year: number }
  >({
    request: () => ({
      userId: this.seletedUser(),
      currentMonth: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getFinancialSummary(
        request.userId,
        request.currentMonth,
        request.year
      ),
  });

  constructor() {
    effect(() => {
      if (this.stateReset() === true) {
        this.stateReset.set(false);
      }
    });
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
