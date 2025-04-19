import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';
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


  salary = rxResource< apiResponse<Salary>, { userId: number; currentMonth: string } >({
    request: () => ({ userId: this.seletedUser(), currentMonth: this.capitalizeFirstLetter(this.currentMonth()) }),
    loader: ({ request }) => this._salaryService.getSalaryByMonth( request.userId, request.currentMonth),
  });


  salaryAiData = rxResource< apiResponse<FinanceSummary>, { userId: number; currentMonth: number; year: number } >({
    request: () => ({ 
      userId: this.seletedUser(), 
      currentMonth: parseInt(this.currentMonthNumber()), 
      year: parseInt(this.currenYear()) 
    }),
    loader: ({ request }) => this._salaryService.getFinancialSummaryAI(request.userId, request.currentMonth, request.year),
  });



  expenseByMonth = rxResource({
    request: () => ({
      userId: this.seletedUser(),
      month: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getTotalExpenseByUserAndMonth(request),
  });

  constructor() {
    effect(() => {
      // console.log([
      //   'salary',  this.salary.value()?.data,
      //   'expenseByMonth',  this.expenseByMonth.value()?.data,
      //   'incomeByMonth',  this.incomeByMonth.value()?.data,
      //   'percentage',  this.percentage(),
      //   'remaining',  this.remaining(),
      //   'totalIncome',  this.totalIncome(),
       
      // ]);
      
      if (this.stateReset() === true) {
        this.salary.reload();
        this.expenseByMonth.reload();
        this.incomeByMonth.reload();
        this.stateReset.set(false);
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

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
