import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../services/salary.service';
import { format } from '@formkit/tempo';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MonthlyExpenseRequest, Salary } from '@models/salary';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { apiResponse } from '@models/apiResponse';

@Component({
  selector: 'app-card-salary',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './card-salary.component.html',
  styleUrl: './card-salary.component.scss',
})
export class CardSalaryComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _salaryService = inject(SalaryService);
  seletdUserId = signal(this._storage.getUserId());
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = computed(() => format(this.timeNow(), 'MMMM', this.lenguaje()));
  currentMonthNumber = computed(() => format(this.timeNow(), 'M', this.lenguaje()));
  currenDate = computed(() => format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje()));
  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  salary = rxResource<
    apiResponse<Salary[]>,
    { userId: number; currentMonth: string }
  >({
    request: () => ({
      userId: this.seletdUserId(),
      currentMonth: this.currentMonth(),
    }),
    loader: ({ request }) =>
      this._salaryService.getSalaryByMonth(
        request.userId,
        request.currentMonth
      ),
  });

  salaryForm = signal<FormGroup>(
    new FormGroup({
      salary_amount: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      effective_date: new FormControl(new Date(), Validators.required),
      description: new FormControl(''),
      month_name: new FormControl('', Validators.required),
    })
  );

  onSubmit() {
    if (this.salaryForm().valid) {
      const salaryData = {
        user_id: this.seletdUserId(),
        ...this.salaryForm().value,
      } as Salary;

      console.log('salaryData: ', salaryData);
      this.salary.reload();

      this._salaryService.createSalary(salaryData).subscribe({
        next: (response) => {
          // Recargar los datos del salario después de guardar
          this.salary.reload();
        },
        error: (error) => {
          console.error('Error al guardar salario', error);
        },
      });
    }
  }

  constructor() {
    effect(() => {
      this.salaryForm().patchValue({
        month_name: this.capitalizeFirstLetter(this.currentMonth()),
        effective_date: this.currenDate(),
      });
      console.log(
        'currentMonthSelected: ',
        this.capitalizeFirstLetter(this.currentMonth())
      );
      console.log('currentDateSelected: ', this.currenDate());
    });
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  expenseByMonth = rxResource({
    request: () => ({
      userId: this.seletdUserId(),
      month: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getTotalExpenseByUserAndMonth(request),
  });

  percentage = computed(() => {
    const salaryData = this.salary.value()?.data?.[0]?.salary_amount;
    const expenseData = this.expenseByMonth.value()?.data?.total;
    if (salaryData && expenseData !== undefined) {
      const salaryAmount = parseFloat(String(salaryData));
      const totalExpense = expenseData;
      return Math.min(Math.round((totalExpense / salaryAmount) * 100), 100);
    }
    return 0;
  });

  remaining = computed(() => {
    const salaryData = this.salary.value()?.data?.[0]?.salary_amount;
    const expenseData = this.expenseByMonth.value()?.data?.total;
    if (salaryData && expenseData !== undefined) {
      const salaryAmount = parseFloat(String(salaryData));
      const totalExpense = expenseData;
      return Math.max(salaryAmount - totalExpense, 0);
    }
    return 0;
  });
}
