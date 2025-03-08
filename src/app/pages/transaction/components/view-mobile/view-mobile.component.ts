import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { apiResponse } from '@models/apiResponse';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'view-mobile',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './view-mobile.component.html',
  
  styleUrl: './view-mobile.component.scss',
})
export class ViewMobileComponent {
  //Signals input que recibe filteredTransactions
  readonly filteredTransactions = input.required<apiResponse<Transaction[]>>();
   readonly currentPage = input.required<number>();
    readonly itemsPerPage = input.required<number>();
  
    // Outputs
    readonly pageChange = output<number>();
    readonly itemsPerPageChange = output<number>();
  
  private readonly _transactionService = inject(TransactionService);
  
  readonly totalType = computed(() =>
    this._transactionService.getTotalType(this.filteredTransactions().data!)
  );
  readonly total = computed(() =>
    this._transactionService.getTotal(this.filteredTransactions().data!)
  );

  // Métodos para manejar cambios en la paginación
  goToPage(page: number): void {
    this.pageChange.emit(page);
  }

  changeItemsPerPage(limit: number): void {
    this.itemsPerPageChange.emit(limit);
  }
}
