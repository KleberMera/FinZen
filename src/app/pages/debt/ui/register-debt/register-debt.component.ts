import { Component, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { FormValidationService } from '@services/form-validation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';

@Component({
  selector: 'app-register-debt',
  imports: [ReactiveFormsModule],
  templateUrl: './register-debt.component.html',
  styleUrl: './register-debt.component.scss',
})
export class RegisterDebtComponent {
  private readonly _debtService = inject(DebtService);
  private readonly _validationService = inject(FormValidationService);
  readonly form = this._debtService.formDebt();

  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }
  protected readonly isSubmitting = signal(false);
  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }
  constructor() {
    // Asignar método francés por defecto
    this.form().patchValue({
      method: 'frances',
    });
  }
  async saveDebt() {}

  calculateEndDate() {
    const startDate = this.form().get('start_date')?.value;
    const duration = this.form().get('duration_months')?.value - 1;
    const fixedDay = this.form().get('fixedDay')?.value;
    if (startDate && duration) {
      if (fixedDay) {
        console.log('fijo');
        console.log(fixedDay);
        //Sumar solo los meses manteniendo el día fijo
        
        
      } else {
        const formatedDate = format(startDate, 'YYYY-MM-DD');
        const endDate = addMonth(formatedDate, duration);
        const newEndDate = format(endDate, 'YYYY-MM-DD');
        this.form().patchValue({
          end_date: newEndDate,
        });
      }
    }
  }
}
