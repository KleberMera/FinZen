import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { FormValidationService } from '@services/form-validation.service';
import { CategoryName } from '@models/category';
import { NgClass } from '@angular/common';

@Component({
  selector: 'form-transactions',
  imports: [ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './form-transactions.component.html',
  styleUrl: './form-transactions.component.scss',
})
export class FormTransactionsComponent {
  private readonly _transactionService = inject(TransactionService);
  private readonly _storageService = inject(StorageService);

  private readonly _validationService = inject(FormValidationService);
  protected readonly isSubmitting = signal(false);
  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );

  type = signal<string[]>(['Ingreso', 'Gasto', 'Todos']);
  selectedType = signal<string>('Todos');
  // Agrega esta señal para controlar el dropdown
  isTypeDropdownOpen = signal(false);

  // Método para alternar el dropdown
  toggleTypeDropdown() {
    this.isTypeDropdownOpen.set(!this.isTypeDropdownOpen());
  }

  // Modificar la señal computada
  filteredCategories = computed(() => {
    const allCategories =
      (this.categories.value()?.data as CategoryName[]) || [];

    return this.selectedType() === 'Todos'
      ? allCategories
      : allCategories.filter(
          (cat: CategoryName) => cat.type === this.selectedType()
        );
  });

  categories = rxResource({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._transactionService.getCategoryNamesByUserId(request.userId),
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
        });
    } catch (error) {
      console.log(error);
      this.isSubmitting.set(false);
    }
  }
}
