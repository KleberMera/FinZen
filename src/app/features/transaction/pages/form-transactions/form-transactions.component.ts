import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { FormValidationService } from '@services/form-validation.service';
import { CategoryName } from '@models/category';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { CardSalaryTransactionComponent } from '../../components/card-salary-transaction/card-salary-transaction.component';

@Component({
  selector: 'form-transactions',
  imports: [ReactiveFormsModule, FormsModule, CardSalaryTransactionComponent],
  templateUrl: './form-transactions.component.html',
  styleUrl: './form-transactions.component.scss',
})
export default class FormTransactionsComponent {
  readonly cardView = viewChild(CardSalaryTransactionComponent);
  private readonly _transactionService = inject(TransactionService);
  private readonly _storageService = inject(StorageService);
  public readonly form = this._transactionService.formTransaction();
  private readonly _validationService = inject(FormValidationService);
  protected readonly isSubmitting = signal(false);
  protected readonly seletedUser = signal<number>( this._storageService.getUserId());

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
          this.cardView()?.stateReset.set(true);
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
}
