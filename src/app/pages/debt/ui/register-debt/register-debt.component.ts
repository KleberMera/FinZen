import { Component, computed, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { FormValidationService } from '@services/form-validation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';
import { toast } from 'ngx-sonner';
import { StorageService } from '@services/storage.service';
import { TableAmortizationComponent } from "../../components/table-amortization/table-amortization.component";
import { BreakpointService } from '@services/breakpoint.service';
import { CardAmortizationComponent } from "../../components/card-amortization/card-amortization.component";

@Component({
  selector: 'app-register-debt',
  imports: [ReactiveFormsModule, TableAmortizationComponent, CardAmortizationComponent],
  templateUrl: './register-debt.component.html',
  styleUrl: './register-debt.component.scss',
})
export class RegisterDebtComponent {
  private readonly _debtService = inject(DebtService);
  protected readonly seletedUser = signal<number>(inject(StorageService).getUserId());
  public readonly _screenService = inject(BreakpointService);
  private readonly _validationService = inject(FormValidationService);
  readonly form = this._debtService.formDebt();
  protected readonly isSubmitting = signal(false);
 
  readonly endDate = computed(() => {
    const startDate = this.form().get('start_date')?.value;
    const duration = this.form().get('duration_months')?.value;

    if (startDate && duration) {
      const endDate = addMonth(format(startDate, 'YYYY-MM-DD'), duration - 1);
      const formattedEndDate = format(endDate, 'YYYY-MM-DD');

      // Actualizar el valor en el formulario
      this.form().patchValue(
        { end_date: formattedEndDate },
        { emitEvent: false }
      );

      return formattedEndDate;
    }

    return null;
  });

  constructor() {
    this.form().patchValue({
      method: 'frances',
      user_id: this.seletedUser(),
    });
  }

  async saveDebt() {
    if (this.form().invalid || this.isSubmitting()) return;
    toast.info('Registrando, esto puede tardar un rato...');
    this.isSubmitting.set(true);
    this._debtService.createDebt(this.form().value).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        toast.success(res.message);
        this.form().reset();
      },
    });
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

  isData(){
    const { amount, interest_rate, duration_months, start_date, end_date } = this.form().value;
    if (amount && interest_rate && duration_months && start_date && end_date) {
      return true;
    }
    return false;
   
   
  }
}
