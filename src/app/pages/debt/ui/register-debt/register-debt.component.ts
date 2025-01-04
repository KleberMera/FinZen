import { Component, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { FormValidationService } from '@services/form-validation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
      method: 'frances'
    });
  }
  async saveDebt() {

  }

  calculateEndDate() {
    const startDate = this.form().get('start_date')?.value;
    const duration = this.form().get('duration_months')?.value;
    const fixedDay = this.form().get('fixedDay')?.value;
  
    if (startDate && duration) {
      const start = new Date(startDate);
      const endDate = new Date(startDate);
      
      if (fixedDay) {
        // Mantener el mismo día del mes
        const day = start.getDate();
        endDate.setMonth(endDate.getMonth() + duration);
        endDate.setDate(day); // Establecer el mismo día
      } else {
        // Cálculo normal
        endDate.setMonth(endDate.getMonth() + duration);
      }
  
      this.form().patchValue({
        end_date: endDate.toISOString().split('T')[0]
      });
    }
  }

}
