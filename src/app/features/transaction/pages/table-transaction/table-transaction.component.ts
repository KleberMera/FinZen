import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ViewDesktopComponent } from '../../components/view-desktop/view-desktop.component';
import { ViewMobileComponent } from '../../components/view-mobile/view-mobile.component';
import { SkeletonFiltersComponent } from '../../components/skeleton-filters/skeleton-filters.component';
import { SkeletonTableTransactionComponent } from '../../components/skeleton-table-transaction/skeleton-table-transaction.component';
import { StorageService } from '@services/storage.service';
import { FilterTransactionService } from '../../services/filter-transaction.service';
import { BreakpointService } from '@services/breakpoint.service';
import { apiResponse } from '@models/apiResponse';
import { Transaction, TransactionName } from '@models/transaction';
import { CategoryName } from '@models/category';
import { rxResource } from '@angular/core/rxjs-interop';



@Component({
  selector: 'table-transaction',
  imports: [FormsModule, ViewDesktopComponent, ViewMobileComponent, SkeletonFiltersComponent, SkeletonTableTransactionComponent],
  templateUrl: './table-transaction.component.html',
  styleUrl: './table-transaction.component.scss',
})
export default class TableTransactionComponent {
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

  filterValue = computed(() => ({
    ...(this.currentPage() && { page: this.currentPage() }),
    ...(this.itemsPerPage() && { limit: this.itemsPerPage() }),
    ...(this.today() && { today: true }),
    ...(this.all() && { all: true }),
    ...(this.transactionName() && { transactionName: this.transactionName() }),
    ...(this.categoryName() && { categoryName: this.categoryName() }),
    ...(this.type() && { type: this.type() }),
    ...(this.useDateRange() ? {
      ...(this.startDate() && { startDate: this.startDate() }),
      ...(this.endDate() && { endDate: this.endDate() })
    } : (this.date() && { date: this.date() }))
  }));

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
  
  // Nuevo método para manejar la eliminación exitosa
  onDeleteSuccess(): void {
    this.filteredTransactions.reload(); // Refresca los datos
  }
}
