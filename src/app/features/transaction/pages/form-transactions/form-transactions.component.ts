import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { FormValidationService } from '@services/form-validation.service';
import { CategoryName } from '@models/category';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { format } from '@formkit/tempo';
import { CurrencyPipe, JsonPipe, NgClass } from '@angular/common';

@Component({
  selector: 'form-transactions',
  imports: [ReactiveFormsModule, FormsModule, CurrencyPipe],
  templateUrl: './form-transactions.component.html',
  styleUrl: './form-transactions.component.scss',
})
export default class FormTransactionsComponent {
  private readonly _transactionService = inject(TransactionService);
  private readonly _storageService = inject(StorageService);
  private readonly _salaryService = inject(SalaryService);

  private readonly _validationService = inject(FormValidationService);
  protected readonly isSubmitting = signal(false);
  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );

  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = computed(() =>
    format(this.timeNow(), 'MMMM', this.lenguaje())
  );

  type = signal<string[]>(['Ingreso', 'Gasto']);
  selectedType = signal<string>('Ingreso');
  // Agrega esta señal para controlar el dropdown
  isTypeDropdownOpen = signal(false);

  // Método para alternar el dropdown
  toggleTypeDropdown() {
    this.isTypeDropdownOpen.set(!this.isTypeDropdownOpen());
  }

  // Modificar la señal computada
  filteredCategories = computed(() => {
    return (this.categories.value()?.data as CategoryName[]) || [];
  });

  categories = rxResource({
    request: () => ({ userId: this.seletedUser(), type: this.selectedType() }),
    loader: ({ request }) =>
      this._transactionService.getCategoryTypeByUserId(
        request.userId,
        request.type
      ),
  });

  public readonly form = this._transactionService.formTransaction();

  paymentMethods = signal([
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'otro', label: 'Otro' },
  ]);

  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  async saveTransaccion(event: SubmitEvent) {
    if (this.form().invalid || this.isSubmitting()) return;
    console.log(this.form().value);
    //Convertir category id a number
    this.form().value.category_id = Number(this.form().value.category_id);
    try {
      this.isSubmitting.set(true);
      this._transactionService
        .createTransaction(this.form().value)
        .subscribe((res) => {
          toast.success(res.message);
          this.form().reset();
          this.isSubmitting.set(false);
          this.stateReset.set(true);
          // this.dataReload();
          this.form().patchValue({
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          });
        });
    } catch (error) {
      console.log(error);
      this.isSubmitting.set(false);
    }
  }

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
