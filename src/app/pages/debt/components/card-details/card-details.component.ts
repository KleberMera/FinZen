import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { format } from '@formkit/tempo';
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

  // Método para obtener el total de cuotas atrasadas
  protected getCuotasAtrasadas(debt: Debt): number {
    const today = format(new Date(), 'YYYY-MM-DD');
    console.log(today);

    return debt.amortizations.filter((a) => {
      const fechaCuota = format(new Date(a.date), 'YYYY-MM-DD');
      console.log(fechaCuota);

      return a.status === 'Pendiente' && fechaCuota < today;
    }).length;
  }

  // Método para calcular el porcentaje pagado
  protected getPorcentajePagado(debt: Debt): number {
    return (this.getPagadas(debt) / debt.duration_months) * 100;
  }
}
