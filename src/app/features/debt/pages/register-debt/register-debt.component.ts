import { Component, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { FormValidationService } from '@services/form-validation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { addDay, addMonth, format } from '@formkit/tempo';
import { toast } from 'ngx-sonner';
import { StorageService } from '@services/storage.service';
import { TableAmortizationComponent } from '../../components/table-amortization/table-amortization.component';
import { BreakpointService } from '@services/breakpoint.service';
import { CardAmortizationComponent } from '../../components/card-amortization/card-amortization.component';
import { MethodService } from '../../services/method.service';
import { firstValueFrom } from 'rxjs';

const AppComponent = [TableAmortizationComponent, CardAmortizationComponent];

@Component({
  selector: 'app-register-debt',
  imports: [AppComponent, ReactiveFormsModule],
  templateUrl: './register-debt.component.html',
  styleUrl: './register-debt.component.scss',
})
export default class RegisterDebtComponent {
  private readonly _debtService = inject(DebtService);
  protected readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  protected readonly _methodService = inject(MethodService);
  public readonly _screenService = inject(BreakpointService);
  private readonly _validationService = inject(FormValidationService);
  readonly form = this._debtService.formDebt();
  protected readonly isSubmitting = signal(false);
  protected readonly showTable = signal<boolean>(false);

  constructor() {
    this.form().patchValue({
      method: 'frances',
      duration_type: 'months', // Default value
      user_id: this.seletedUser(),
    });

    // Add listener for method changes to update the form
    this.form()
      .get('method')
      ?.valueChanges.subscribe((method) => {
        if (method === 'ninguno') {
          this.form().addControl('duration_type', new FormControl('months'));
        } else {
          if (this.form().contains('duration_type')) {
            this.form().removeControl('duration_type');
          }
        }
        // Recalculate end date when method changes
        this.updateEndDate();
      });

    // Add listener for duration type changes
    this.form().valueChanges.subscribe(() => {
      this.updateEndDate();
    });
  }

  // Replace your current endDate computed with this method
  updateEndDate() {
    const startDate = this.form().get('start_date')?.value;
    const duration = this.form().get('duration_months')?.value;
    const method = this.form().get('method')?.value;
    const durationType =
      method === 'ninguno' ? this.form().get('duration_type')?.value : 'months';

    if (startDate && duration) {
      let endDate;

      if (durationType === 'days') {
        // Add days to the start date
        endDate = addDay(format(startDate, 'YYYY-MM-DD'), duration - 1);
      } else {
        // Add months to the start date (existing behavior)
        // console.log('months');
        // console.log('startDate', startDate);
        
        endDate = addMonth(format(startDate, 'YYYY-MM-DD'), duration - 1);
        // console.log('endDate', endDate);
        
      }

      const formattedEndDate = format(endDate, 'YYYY-MM-DD');

      // Update the end date in the form
      this.form().patchValue(
        { end_date: formattedEndDate },
        { emitEvent: false }
      );

      return formattedEndDate;
    }

    return null;
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

  // Reemplaza el método calcular() existente
  calcular() {
    // Verificar si el formulario tiene los datos necesarios
    const { amount, interest_rate, duration_months, start_date, method } =
      this.form().value;
  
     

    if (amount && duration_months && start_date && method) {
      // Calcular la amortización según el método seleccionado
      if (method === 'frances') {        
        if(interest_rate === 0 || interest_rate=== null) {
          toast.error('La tasa de interés no puede ser 0 para el método francés');
        
        } else {
          this._methodService.calculateFrenchAmortization(this.form());
        }
      } else if (method === 'aleman') {
        this._methodService.calculateGermanAmortization(this.form());
      } else if (method === 'ninguno') {
        this._methodService.calculateNoneAmortization(this.form());
      }

      // Mostrar la tabla
      this.showTable.set(true);
    } else {
      toast.error('Por favor completa todos los campos necesarios');
      this.showTable.set(false);
    }
  }

  async saveDebt() {
    if (this.form().invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);
    const debtPromise = firstValueFrom(this._debtService.createDebt(this.form().value));
    toast.promise(debtPromise, {
      loading: 'Registrando, esto puede tardar un rato...',
      success: (res) => {
        this.resetFiels();
        this.isSubmitting.set(false);
        return res.message;
      },
     
    });
  }

  resetFiels() {
    this.form().reset();
    this.showTable.set(false);
    this.form().patchValue({
      method: 'frances',
      duration_type: 'months',
      user_id: this.seletedUser(),
    });
  }
}
