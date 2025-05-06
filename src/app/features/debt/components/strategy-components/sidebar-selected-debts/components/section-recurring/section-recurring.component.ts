import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { SnowballService } from '../../../../../services/snowball.service';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-section-recurring',
  imports: [NgClass],
  templateUrl: './section-recurring.component.html',
  styleUrl: './section-recurring.component.scss'
})
export class SectionRecurringComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);

  
  seletdUserId = signal(this._storage.getUserId());
  selectedTransactionIds = signal<number[]>([]);
  
  // Recurring transactions
  recurringTransactions = rxResource({
    request: () => ({ userId: this.seletdUserId() }),
    loader: ({ request }) =>
      this._snowballService.getRecurringTransaction(request.userId),
  });
  
  // Calcular si todos los items están seleccionados
  allTransactionsSelected = computed(() => {
    if (!this.recurringTransactions.value()?.length) return false;
    return this.selectedTransactionIds().length === this.recurringTransactions.value()?.length;
  });
  
  // Al inicializar, pre-seleccionar todas las transacciones recurrentes
  constructor() {
    effect(() => {
      if (this.recurringTransactions.value()?.length) {
        this.selectedTransactionIds.set(
          this.recurringTransactions
            .value()
            ?.map((transaction) => transaction.id)
            .filter((id): id is number => id !== undefined) || []
        );
      }
    });
  }
  

  // Métodos para manejar la selección
  toggleAllTransactions() {
    if (this.allTransactionsSelected()) {
      this.selectedTransactionIds.set([]);
    } else {
      this.selectedTransactionIds.set(
        this.recurringTransactions
          .value()
          ?.map((transaction) => transaction.id)
          .filter((id): id is number => id !== undefined) || []
      );
    }
  }
  
  isTransactionSelected(transactionId: number): boolean {
    return this.selectedTransactionIds().includes(transactionId);
  }
  
  toggleTransaction(transactionId: number) {
    this.selectedTransactionIds.update((ids) => {
      if (ids.includes(transactionId)) {
        return ids.filter((id) => id !== transactionId);
      } else {
        return [...ids, transactionId];
      }
    });
  }

}
