import { Component, computed, inject, input, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { StorageService } from '@services/storage.service';
import { BreakpointService } from '@services/breakpoint.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { apiResponse } from '@models/apiResponse';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'filters-transaction',
  imports: [FormsModule],
  templateUrl: './filters-transaction.component.html',
  styleUrl: './filters-transaction.component.scss'
})
export class FiltersTransactionComponent {

  private readonly _transactionService = inject(TransactionService);
  private readonly _storageService = inject(StorageService);
  protected readonly seletedUser = signal<number>(this._storageService.getUserId());
  private readonly _breakpointService = inject(BreakpointService);
  public transactions = input.required<apiResponse<Transaction[]>>( );
  protected readonly isMobile$ = this._breakpointService.isMobileView();
  // Signals para los filtros
  protected readonly categoryFilter = signal<string>('');
  protected readonly nameFilter = signal<string>('');
  protected readonly typeFilter = signal<string>('');

  // Signal computada para las transacciones filtradas
  protected readonly filteredTransactions = computed(() => {
    const transactions = this.transactions().data ?? [];
    return transactions.filter(trans => {
      const matchCategory = this.categoryFilter() === '' ||
        trans.category?.name.toLowerCase().includes(this.categoryFilter().toLowerCase());
      const matchName = this.nameFilter() === '' ||
        trans.name.toLowerCase().includes(this.nameFilter().toLowerCase());
      const matchType = this.typeFilter() === '' ||
        trans.category?.type === this.typeFilter();

      return matchCategory && matchName && matchType;
    });
  });

  constructor() {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[id$="-dropdown"]')) {
        document.querySelectorAll('[id$="-dropdown-menu"]').forEach(menu => {
          menu.classList.add('hidden');
        });
      }
    });
  }


  toggleDropdown(dropdownId: 'name' | 'category' | 'type'): void {
    const menu = document.getElementById(`${dropdownId}-dropdown-menu`);
    const allMenus = document.querySelectorAll('[id$="-dropdown-menu"]');

    // Ocultar todos los demás dropdowns
    allMenus.forEach(element => {
      if (element.id !== `${dropdownId}-dropdown-menu`) {
        element.classList.add('hidden');
      }
    });

    // Alternar el dropdown actual
    menu?.classList.toggle('hidden');
  }

  // Signals para las opciones de los filtros
  protected readonly uniqueCategories = computed(() => {
    const transactions = this.transactions().data ?? [];
    return [...new Set(transactions.map(t => t.category?.name ?? ''))].filter(Boolean);
  });

  protected readonly uniqueNames = computed(() => {
    const transactions = this.transactions().data ?? [];
    return [...new Set(transactions.map(t => t.name))];
  });

  protected readonly types = ['Ingreso', 'Gasto'];

  
}
