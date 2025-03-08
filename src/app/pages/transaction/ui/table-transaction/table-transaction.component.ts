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
  imports: [ AppComponent, SearchFilterTransactionComponent],
  templateUrl: './table-transaction.component.html',
  styleUrl: './table-transaction.component.scss',
})
export class TableTransactionComponent {

  
}
