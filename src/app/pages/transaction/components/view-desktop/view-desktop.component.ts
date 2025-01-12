import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'view-desktop',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './view-desktop.component.html',
  styleUrl: './view-desktop.component.scss',
})
export class ViewDesktopComponent {
  //Signals input que recibe filteredTransactions
  readonly filteredTransactions = input.required<Transaction[]>();
  private readonly _transactionService = inject(TransactionService);
 
  readonly totalType = computed(() =>
    this._transactionService.getTotalType(this.filteredTransactions())
  );
  
  readonly total = computed(() =>
    this._transactionService.getTotal(this.filteredTransactions())
    
  );
}
