import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule, NgModel } from '@angular/forms';
import { StorageService } from '@services/storage.service';
import { FilterTransactionService } from '../../services/filter-transaction.service';
import { apiResponse } from '@models/apiResponse';
import { Transaction, TransactionName } from '@models/transaction';
import { CategoryName } from '@models/category';
import { ViewDesktopComponent } from '../view-desktop/view-desktop.component';
import { BreakpointService } from '@services/breakpoint.service';
import { ViewMobileComponent } from '../view-mobile/view-mobile.component';

@Component({
  selector: 'app-search-filter-transaction',
  imports: [FormsModule, ViewDesktopComponent, ViewMobileComponent],
  templateUrl: './search-filter-transaction.component.html',
  styleUrl: './search-filter-transaction.component.scss',
})
export class SearchFilterTransactionComponent {
  transactionName = signal<string>('');
  categoryName = signal<string>('');
  type = signal<string>('');
  date = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');
  all = signal<boolean>(false);
  useDateRange = signal<boolean>(false);
  today = signal<boolean>(true);
  currentPage = signal<number|null>(null);
  itemsPerPage = signal<number|null>(null);
  isFormVisible = signal<boolean>(true);


  clearFilters(): void {
    this.transactionName.set('');
    this.categoryName.set('');
    this.type.set('');
    this.date.set('');
    this.startDate.set('');
    this.endDate.set('');
    this.today.set(true);
    this.useDateRange.set(false);
    this.all.set(false);
    this.currentPage.set(null);
    this.itemsPerPage.set(null);
  }


  toggleFormVisibility(): void {
    this.isFormVisible.set(!this.isFormVisible());
  }

  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  private readonly _FilterTransactionService = inject(FilterTransactionService);
  public readonly _screenService = inject(BreakpointService);

  transactionNames = rxResource<apiResponse<TransactionName>,{ userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._FilterTransactionService.getTransactionNamesByUserId( request.userId),
  });

  categoryNames = rxResource<apiResponse<CategoryName>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._FilterTransactionService.getCategoryNamesByUserId(request.userId),
  });


  filteredTransactions = rxResource<apiResponse<Transaction[]>, { userId: number; filters: any }>({
    request: () => ({ userId: this.seletedUser(), filters: this.filterValue() }),
    loader: ({ request }) => this._FilterTransactionService.getFilteredTransactions( request.userId, request.filters),
  });

  filterValue = computed(() => {
    const filters: any = {};

    if(this.currentPage()){
      filters.page = this.currentPage();
    }

    if (this.itemsPerPage()) {
      filters.limit = this.itemsPerPage();
    }
  

    // Solo agregar 'today' si es true
    if (this.today()) {
      filters.today = true;
    }

    // Solo agregar 'all' si es true
    if (this.all()) {
      filters.all = true;
      //filters.limit = this.itemsPerPage();
    }

    // Solo agregar 'transactionName' si tiene un valor
    if (this.transactionName()) {
      filters.transactionName = this.transactionName();
    }

    // Solo agregar 'categoryName' si tiene un valor
    if (this.categoryName()) {
      filters.categoryName = this.categoryName();
    }

    // Solo agregar 'type' si tiene un valor
    if (this.type()) {
      filters.type = this.type();
    }

    // Solo agregar 'startDate' y 'endDate' si useDateRange es true y tienen valores
    if (this.useDateRange()) {
      if (this.startDate()) {
        filters.startDate = this.startDate();
      }
      if (this.endDate()) {
        filters.endDate = this.endDate();
      }
    } else {
      // Solo agregar 'date' si tiene un valor
      if (this.date()) {
        filters.date = this.date();
      }
    }

    return filters;
  });

  constructor() {
    // Reaccionar a cambios en filterValue
    // effect(() => {
    //   const filters = this.filterValue();
    //   console.log('Filtros actualizados:', filters);
    //   // Aquí puedes forzar una nueva solicitud si es necesario
    //   //this.filteredTransactions.reload();
    // });
  }
  setUseDateRange(value: boolean): void {
    this.useDateRange.set(value);
  }

  setDate(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.date.set(target.value);
  }

  setStartDate(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.startDate.set(target.value);
  }

  setEndDate(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.endDate.set(target.value);
  }


  goToPage(page: number): void {
    this.currentPage.set(page); // Actualiza la página actual
    //this.filteredTransactions.reload(); // Vuelve a cargar los datos
  }
  
  changeItemsPerPage(limit: number): void {
    this.itemsPerPage.set(limit); // Actualiza el límite de elementos por página
    this.currentPage.set(1); // Reinicia la página a la primera
   // this.filteredTransactions.refresh(); // Vuelve a cargar los datos
  }
}
