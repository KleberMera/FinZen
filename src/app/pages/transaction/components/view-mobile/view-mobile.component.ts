import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { apiResponse } from '@models/apiResponse';

@Component({
  selector: 'view-mobile',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './view-mobile.component.html',
  styleUrl: './view-mobile.component.scss',
})
export class ViewMobileComponent {
  //Signals input que recibe filteredTransactions
  readonly filteredTransactions = input.required<apiResponse<Transaction[]>>();
  
  private readonly _transactionService = inject(TransactionService);
  
  readonly totalType = computed(() =>
    this._transactionService.getTotalType(this.filteredTransactions().data!)
  );
  readonly total = computed(() =>
    this._transactionService.getTotal(this.filteredTransactions().data!)
  );
}
