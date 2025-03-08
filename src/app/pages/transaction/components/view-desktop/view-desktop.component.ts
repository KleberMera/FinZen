import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  output,
  Output,
} from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { apiResponse } from '@models/apiResponse';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'view-desktop',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './view-desktop.component.html',
  styleUrl: './view-desktop.component.scss',
})
export class ViewDesktopComponent {
  // Signals input que recibe filteredTransactions
  readonly filteredTransactions = input.required<apiResponse<Transaction[]>>();
  readonly currentPage = input.required<number>();
  readonly itemsPerPage = input.required<number>();

  // Outputs
  readonly pageChange = output<number>();
  readonly itemsPerPageChange = output<number>();
  private readonly _transactionService = inject(TransactionService);

  // Para uso en la plantilla
  readonly Math = Math;

  readonly totalType = computed(() =>
    this._transactionService.getTotalType(this.filteredTransactions().data!)
  );

  readonly total = computed(() =>
    this._transactionService.getTotal(this.filteredTransactions().data!)
  );

  getPaginationRange() {
    const currentPage = this.filteredTransactions().pagination?.page!;
    const totalPages = this.filteredTransactions().pagination?.totalPages!;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Si estamos cerca del principio
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    // Si estamos cerca del final
    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Si estamos en medio
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }

  // Métodos para manejar cambios en la paginación
  goToPage(page: number): void {
    this.pageChange.emit(page);
  }

  changeItemsPerPage(limit: number): void {
    this.itemsPerPageChange.emit(limit);
  }
}
