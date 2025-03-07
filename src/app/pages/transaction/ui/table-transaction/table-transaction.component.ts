import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { BreakpointService } from '@services/breakpoint.service';
import { LoaderComponent } from '@components/loader/loader.component';
import { SkeletonFiltersComponent } from "../../components/skeleton-filters/skeleton-filters.component";
import { ViewDesktopComponent } from "../../components/view-desktop/view-desktop.component";
import { ViewMobileComponent } from "../../components/view-mobile/view-mobile.component";
import { apiResponse } from '@models/apiResponse';
import { Transaction } from '@models/transaction';
import { FiltersTransactionComponent } from "../../components/filters-transaction/filters-transaction.component";
import { SearchFilterTransactionComponent } from "../../components/search-filter-transaction/search-filter-transaction.component";
export const AppComponent = [LoaderComponent, SkeletonFiltersComponent, ViewDesktopComponent, ViewMobileComponent, FiltersTransactionComponent];

export interface Filters {
  category: string;
  name: string;
  type: string;
}

@Component({
  selector: 'table-transaction',
  imports: [NgTemplateOutlet, AppComponent, SearchFilterTransactionComponent],
  templateUrl: './table-transaction.component.html',
  styleUrl: './table-transaction.component.scss',
})
export class TableTransactionComponent {

  private readonly _transactionService = inject(TransactionService);
  private readonly seletedUser = signal<number>(inject(StorageService).getUserId());
  public readonly _screenService = inject(BreakpointService);
  protected readonly filters = signal<Filters>({ category: '', name: '', type: '' });

  transactions = rxResource<apiResponse<Transaction[]>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._transactionService.getTransactionByUserId(request.userId),
  });

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

  onFilterChange(newFilters: { category: string; name: string; type: string }) {
    this.filters.set(newFilters);
  }
}
