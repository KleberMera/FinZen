import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Debt } from '@models/debt';

@Component({
  selector: 'app-card-details',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent {
  readonly debts = input.required<Debt[]>();

  // Método para obtener el número de cuotas pagadas
  protected getPagadas(debt: Debt): number {
    return debt.amortizations.filter((a) => a.status === 'Pagado').length;
  }

  // Método para obtener el total pagado
  protected getTotalPagado(debt: Debt): number {
    return debt.amortizations
      .filter((a) => a.status === 'Pagado')
      .reduce((sum, a) => sum + Number(a.quota), 0);
  }

  // Método para obtener el total por pagar
  protected getTotalPorPagar(debt: Debt): number {
    return debt.amortizations
      .filter((a) => a.status === 'Pendiente')
      .reduce((sum, a) => sum + Number(a.quota), 0);
  }

  // Método para obtener cuotas atrasadas
  protected getCuotasAtrasadas(debt: Debt): number {
    const today = new Date();
    return debt.amortizations.filter((a) => {
      const fechaCuota = new Date(a.date);
      return a.status === 'Pendiente' && fechaCuota < today;
    }).length;
  }

  // Método para calcular el porcentaje pagado
  protected getPorcentajePagado(debt: Debt): number {
    return (this.getPagadas(debt) / debt.duration_months) * 100;
  }
}
