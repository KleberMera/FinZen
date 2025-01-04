import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'view-mobile',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './view-mobile.component.html',
  styleUrl: './view-mobile.component.scss'
})
export class ViewMobileComponent {
//Signals input que recibe filteredTransactions
  readonly filteredTransactions = input.required<Transaction[]>();


  get total() {
    return this.filteredTransactions()
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }

  get totalType() {
    const ingresos = this.filteredTransactions()
      .filter(t => t.category?.type === 'Ingreso')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const gastos = this.filteredTransactions()
      .filter(t => t.category?.type !== 'Ingreso')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return ingresos >= gastos ? 'Ingreso' : 'Gasto';
  }
}
