import { Component, computed, inject, output, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AsyncPipe, CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointService } from '@services/breakpoint.service';
import { LoaderComponent } from '@components/loader/loader.component';
import { SkeletonFiltersComponent } from "../../components/skeleton-filters/skeleton-filters.component";
import { ViewDesktopComponent } from "../../components/view-desktop/view-desktop.component";
import { ViewMobileComponent } from "../../components/view-mobile/view-mobile.component";
import { apiResponse } from '@models/apiResponse';
import { Transaction } from '@models/transaction';
import { FiltersTransactionComponent } from "../../components/filters-transaction/filters-transaction.component";
export const AppComponent = [LoaderComponent, SkeletonFiltersComponent, ViewDesktopComponent, ViewMobileComponent, FiltersTransactionComponent];

@Component({
  selector: 'table-transaction',
  imports: [AsyncPipe, NgTemplateOutlet, AppComponent],
  templateUrl: './table-transaction.component.html',
  styleUrl: './table-transaction.component.scss',
})
export class TableTransactionComponent {

  private readonly _transactionService = inject(TransactionService);
  private readonly _storageService = inject(StorageService);
  private readonly _breakpointService = inject(BreakpointService);

  protected readonly seletedUser = signal<number>(this._storageService.getUserId());
  protected readonly isMobile$ = this._breakpointService.isMobileView();

  protected readonly filters = signal<{
    category: string;
    name: string;
    type: string;
  }>({ category: '', name: '', type: '' });

  protected readonly filteredTransactions = computed(() => {
    const transactions = this.transactions.value()?.data ?? [];
    return transactions.filter(trans => {
      const matchCategory = this.filters().category === '' ||
        trans.category?.name.toLowerCase().includes(this.filters().category.toLowerCase());
      const matchName = this.filters().name === '' ||
        trans.name.toLowerCase().includes(this.filters().name.toLowerCase());
      const matchType = this.filters().type === '' ||
        trans.category?.type === this.filters().type;

      return matchCategory && matchName && matchType;
    });
  });

  public transactions = rxResource<apiResponse<Transaction[]>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._transactionService.getTransactionByUserId(request.userId),
  });

  onFilterChange(newFilters: { category: string; name: string; type: string }) {
    this.filters.set(newFilters);
  }
}
