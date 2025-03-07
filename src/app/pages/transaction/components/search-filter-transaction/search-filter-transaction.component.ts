import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule, NgModel } from '@angular/forms';
import { StorageService } from '@services/storage.service';
import { FilterTransactionService } from '../../services/filter-transaction.service';
import { apiResponse } from '@models/apiResponse';
import { TransactionName } from '@models/transaction';
import { CategoryName } from '@models/category';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-search-filter-transaction',
  imports: [FormsModule],
  templateUrl: './search-filter-transaction.component.html',
  styleUrl: './search-filter-transaction.component.scss'
})
export class SearchFilterTransactionComponent {
  transactionName = signal<string>('');
  categoryName = signal<string>('');
  type = signal<string>('');
  date = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');
  useDateRange = signal<boolean>(false);
  
  today = signal<boolean>(true);
  private readonly seletedUser = signal<number>(inject(StorageService).getUserId());
  private readonly _FilterTransactionService = inject(FilterTransactionService);



  transactionNames = rxResource<apiResponse<TransactionName>, { userId: number }>({
      request: () => ({ userId: this.seletedUser() }),
      loader: ({ request }) =>
        this._FilterTransactionService.getTransactionNamesByUserId(request.userId),
    });

  categoryNames =  rxResource<apiResponse<CategoryName>, { userId: number }>({
      request: () => ({ userId: this.seletedUser() }),
      loader: ({ request }) =>
        this._FilterTransactionService.getCategoryNamesByUserId(request.userId),
    });

  // Señal computada que determina la descripción del filtro activo
  activeFilterDescription = computed(() => {
    if (this.useDateRange()) {
      return `Rango de fechas: ${this.startDate()} al ${this.endDate()}`;
    } else {
      return `Fecha única: ${this.date()}`;
    }
  });

  // Señal computada para el objeto de filtro completo
  filterValue = computed(() => {
    if (this.useDateRange()) {
      return {
        type: 'range',
        startDate: this.startDate(),
        endDate: this.endDate()
      };
    } else {
      return {
        type: 'single',
        date: this.date()
      };
    }
  });

  constructor() {
    // Efecto que se ejecuta cada vez que cambia el filtro (solo para demostración)
    effect(() => {
      const filter = this.filterValue();
      console.log('Filtro actualizado:', filter);
      // Aquí podrías realizar acciones adicionales cuando cambie el filtro
    });
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
}
