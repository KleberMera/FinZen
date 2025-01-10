import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MethodService } from '../../services/method.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Debt } from '@models/debt';

@Component({
  selector: 'app-table-amortization',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './table-amortization.component.html',
  styleUrl: './table-amortization.component.scss',
})
export class TableAmortizationComponent {
  readonly totalMonths = signal<number>(0);
  readonly formData = input.required<FormGroup>();
  readonly filters = input<Debt>();

  private readonly _methodService = inject(MethodService);

  // Computed para manejar los datos que se mostrarán
  protected readonly datos = computed(() => {
    // Si viene de configuración directa, usamos esos datos
    if (this.filters()) {
      return this.filters()!.amortizations;
    }
    // Si viene del formulario, usamos los datos de amortización
    return this.formData()?.get('amortizations')?.value || [];
  });

  // Computed para determinar si mostrar el estado
  /* protected readonly mostrarEstado = computed(() => {
    return this.configuracion()?.mostrarEstado ?? false;
  });*/

  constructor() {
    // Effect solo para el caso del formulario
    effect(() => {
      // Solo ejecutamos si tenemos formData
      if (this.formData()) {
        const method = this.formData()!.get('method')?.value;
        if (method === 'frances') {
          this._methodService.calculateFrenchAmortization(this.formData()!);
          const amortizations =
            this.formData().get('amortizations')?.value || [];
          this.totalMonths.set(amortizations.length);
        } else {
          this._methodService.calculateGermanAmortization(this.formData()!);
          const amortizations =
            this.formData().get('amortizations')?.value || [];
          this.totalMonths.set(amortizations.length);
        }
      }
    });
  }
}
