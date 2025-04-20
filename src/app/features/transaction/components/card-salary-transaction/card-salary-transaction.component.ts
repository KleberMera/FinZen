import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { dayEnd, format, monthEnd } from '@formkit/tempo';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { apiResponse } from '@models/apiResponse';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FinanceSummary } from '@models/finance';
interface FinancialData {
  totalIncome: string;
  salaryAmount: string;
  otherIncome: string;
  totalExpenses: string;
  netBalance: string;
  expensePercentage: string;
  daysPassedPercentage: string;
  expectedExpensesByTime: string;
  timeAdjustedExpensePercentage: string;
  recommendation: string;
}

interface ApiResponse {
  message: string;
  data: FinancialData;
}
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
        this.salaryData.reload();
        this.stateReset.set(false);
      }
    });
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }





  activeMetric = signal<'actual' | 'expected' | 'days'>('actual');



  setActiveMetric(metric: 'actual' | 'expected' | 'days'): void {
    this.activeMetric.set(metric);
  }

  displayPercentage(): string {
    const data = this.salaryData.value()?.data;
    if (!data) return '0';

    switch (this.activeMetric()) {
      case 'actual':
        return parseFloat(String(data.expensePercentage)).toFixed(2);
      case 'expected':
        return parseFloat(String(data.timeAdjustedExpensePercentage)).toFixed(2);
      case 'days':
        return parseFloat(String(data.daysPassedPercentage)).toFixed(2);
      default:
        return '0';
    }
  }

  activeMetricLabel(): string {
    switch (this.activeMetric()) {
      case 'actual':
        return 'Gastos actuales';
      case 'expected':
        return 'Gastos esperados';
      case 'days':
        return 'Días transcurridos';
      default:
        return '';
    }
  }

  getRecommendationClass(): string {
    const expensePercentage = parseFloat(String(this.salaryData.value()?.data!.expensePercentage));
    if (expensePercentage < 50) {
      return 'bg-cyan-900/20 text-cyan-400';
    } else if (expensePercentage < 80) {
      return 'bg-yellow-900/20 text-yellow-400';
    } else {
      return 'bg-red-900/20 text-red-400';
    }
  }

  getRecommendationIcon(): string {
    const expensePercentage = parseFloat(String(this.salaryData.value()?.data!.expensePercentage));
    if (expensePercentage < 50) {
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    } else if (expensePercentage < 80) {
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
    } else {
      return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getCurrentDay(): number {
    return dayEnd(this.timeNow()).getDate();
  }

  getDaysInMonth(): number {
    return monthEnd(this.timeNow()).getDate();
    
  }
}
