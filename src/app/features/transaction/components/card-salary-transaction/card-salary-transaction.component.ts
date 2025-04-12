import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-salary-transaction',
  imports: [CurrencyPipe],
  templateUrl: './card-salary-transaction.component.html',
  styleUrl: './card-salary-transaction.component.scss'
})
export class CardSalaryTransactionComponent {
  private readonly _storageService = inject(StorageService);
  private readonly _salaryService = inject(SalaryService);
  protected readonly isSubmitting = signal(false);
  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );

  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = computed(() =>
    format(this.timeNow(), 'MMMM', this.lenguaje())
  );
  salary = rxResource<
    apiResponse<Salary>,
    { userId: number; currentMonth: string }
  >({
    request: () => ({
      userId: this.seletedUser(),
      currentMonth: this.capitalizeFirstLetter(this.currentMonth()),
    }),
    loader: ({ request }) =>
      this._salaryService.getSalaryByMonth(
        request.userId,
        request.currentMonth
      ),
  });

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  currentMonthNumber = computed(() =>
    format(this.timeNow(), 'M', this.lenguaje())
  );
  currenDate = computed(() =>
    format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje())
  );
  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  expenseByMonth = rxResource({
    request: () => ({
      userId: this.seletedUser(),
      month: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getTotalExpenseByUserAndMonth(request),
  });

  stateReset = signal(false);

  constructor() {
    effect(() => {
      if (this.stateReset() === true) {
        this.salary.reload();
        this.expenseByMonth.reload();
        this.incomeByMonth.reload();
        this.stateReset.set(false);
        this.isSubmitting.set(false);
      }
    });
  }

  incomeByMonth = rxResource({
    request: () => ({
      userId: this.seletedUser(),
      month: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getTotalIncomeByUserAndMonth(request),
  });

  // Método para calcular el porcentaje de gasto
  percentage = computed(() => {
    const salaryData = this.salary.value()?.data?.salary_amount || 0;
    const incomeData = this.incomeByMonth.value()?.data?.total || 0;
    const totalIncome =
      parseFloat(String(salaryData)) + parseFloat(String(incomeData));
    const expenseData = this.expenseByMonth.value()?.data?.total || 0;
    if (totalIncome > 0) {
      return Math.min(Math.round((expenseData / totalIncome) * 100), 100);
    }
    return 0;
  });

  // Método para calcular el monto restante
  remaining = computed(() => {
    const salaryData = this.salary.value()?.data?.salary_amount || 0;
    const incomeData = this.incomeByMonth.value()?.data?.total || 0;
    const totalIncome =
      parseFloat(String(salaryData)) + parseFloat(String(incomeData));
    const expenseData = this.expenseByMonth.value()?.data?.total || 0;
    return Math.max(totalIncome - expenseData, 0);
  });

  //SEñal computada del total mas ingresos
  totalIncome = computed(() => {
    const salaryData = this.salary.value()?.data?.salary_amount || 0;
    const incomeData = this.incomeByMonth.value()?.data?.total || 0;
    const totalIncome =
      parseFloat(String(salaryData)) + parseFloat(String(incomeData));
    return totalIncome;
  });
}
