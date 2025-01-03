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
}
