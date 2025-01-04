import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'view-desktop',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './view-desktop.component.html',
  styleUrl: './view-desktop.component.scss'
})
export class ViewDesktopComponent {
  //Signals input que recibe filteredTransactions
  readonly filteredTransactions = input.required<Transaction[]>();

  get total() {
    return this.filteredTransactions()
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }

  // Nuevo método para determinar el tipo dominante
  get totalType() {
    const ingresos = this.filteredTransactions()
      .filter(t => t.category?.type === 'Ingreso')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const gastos = this.filteredTransactions()
      .filter(t => t.category?.type !== 'Ingreso')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return ingresos >= gastos ? 'Ingreso' : 'Gasto';
  }

  // get totalIngresos() {
  //   return this.filteredTransactions()
  //     .filter(t => t.category?.type === 'Ingreso')
  //     .reduce((sum, t) => sum + (t.amount || 0), 0);
  // }

  // get totalEgresos() {
  //   return this.filteredTransactions()
  //     .filter(t => t.category?.type !== 'Ingreso')
  //     .reduce((sum, t) => sum + (t.amount || 0), 0);
  // }

  // get saldoTotal() {
  //   return this.totalIngresos - this.totalEgresos;
  // }
}
