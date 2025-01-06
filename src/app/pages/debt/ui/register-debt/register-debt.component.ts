import { Component, computed, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { FormValidationService } from '@services/form-validation.service';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';
import { TableFrancesComponent } from "../../components/table-frances/table-frances.component";

@Component({
  selector: 'app-register-debt',
  imports: [ReactiveFormsModule, TableFrancesComponent],
  templateUrl: './register-debt.component.html',
  styleUrl: './register-debt.component.scss',
})
export class RegisterDebtComponent {
  private readonly _debtService = inject(DebtService);
  private readonly _validationService = inject(FormValidationService);
  readonly form = this._debtService.formDebt();
  protected readonly isSubmitting = signal(false);
  constructor() {
    // Asignar método francés por defecto
    this.form().patchValue({
      method: 'frances',
    });
  }
   
 

  calculateEndDate() {
    const startDate = this.form().get('start_date')?.value;
    const duration = this.form().get('duration_months')?.value - 1;

    if (startDate && duration) {
      const formatedDate = format(startDate, 'YYYY-MM-DD');
      const endDate = addMonth(formatedDate, duration);
      const newEndDate = format(endDate, 'YYYY-MM-DD');
      this.form().patchValue({
        end_date: newEndDate,
      });
    }
  }

  get amortizationArray() {
    return this.form().get('amortizations') as FormArray;
  }
  async saveDebt() {
    console.log(this.form().value);
    
  }

  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }
  
  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }
}
