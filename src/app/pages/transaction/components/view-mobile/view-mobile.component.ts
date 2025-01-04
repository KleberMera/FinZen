import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'view-mobile',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './view-mobile.component.html',
  styleUrl: './view-mobile.component.scss',
})
export class ViewMobileComponent {
  //Signals input que recibe filteredTransactions
  private readonly _transactionService = inject(TransactionService);
  readonly filteredTransactions = input.required<Transaction[]>();
  readonly totalType = computed(() =>
    this._transactionService.getTotalType(this.filteredTransactions())
  );
  readonly total = computed(() =>
    this._transactionService.getTotal(this.filteredTransactions())
  );
}
