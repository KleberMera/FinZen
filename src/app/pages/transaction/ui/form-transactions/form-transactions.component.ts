import { Component, inject, Output, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { FormValidationService } from '@services/form-validation.service';

@Component({
  selector: 'form-transactions',
  imports: [ReactiveFormsModule],
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
  readonly categories = toSignal(
    this._transactionService.getCategoriesByUserId(this.seletedUser())
  );

  public readonly form = this._transactionService.formTransaction();
 
 

  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  async saveTransaccion( event: SubmitEvent) {
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
