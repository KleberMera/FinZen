import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StorageService } from '@services/storage.service';
import { FilterTransactionService } from '../../services/filter-transaction.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transaction-recurrent',
  imports: [CurrencyPipe],
  templateUrl: './transaction-recurrent.component.html',
  styleUrl: './transaction-recurrent.component.scss'
})
export class TransactionRecurrentComponent {
  protected readonly _storageService = inject(StorageService);
  protected readonly _filterTransactionService = inject(FilterTransactionService);
  
  // Selected user ID
  seletdUserId = signal<number>(this._storageService.getUserId());

  // Recurring transactions
  recurringTransactions = rxResource({
    request: () => ({ userId: this.seletdUserId() }),
    loader: ({ request }) =>
      this._filterTransactionService.getRecurringTransactions(request.userId),
  });

  getTransactionsByType(type: string) {
  return this.recurringTransactions.value()?.filter(tx => tx.category.type === type) || [];
}

getTotalByType(type: string): number {
  return this.getTransactionsByType(type)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

getNetTotal(): number {
  return this.getTotalByType('Ingreso') - this.getTotalByType('Gasto');
}
}
