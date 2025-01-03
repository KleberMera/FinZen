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
}
