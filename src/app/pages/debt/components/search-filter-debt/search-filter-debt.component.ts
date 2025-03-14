import { Component, computed, inject, signal } from '@angular/core';
import { FilterDebtService } from '../../services/filter-debt.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { FormsModule } from '@angular/forms';
import { SkeletonDebtsComponent } from '../skeleton/skeleton-debts/skeleton-debts.component';

@Component({
  selector: 'app-search-filter-debt',
  imports: [FormsModule, SkeletonDebtsComponent],
  templateUrl: './search-filter-debt.component.html',
  styleUrl: './search-filter-debt.component.scss',
})
export class SearchFilterDebtComponent {
  protected readonly selectedDebtId = signal<number>(1);
  protected readonly _filter = inject(FilterDebtService);
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );

   //Señal computada con el nombre de la deuda seleccionada
   selectedDebt = computed(() => {
    return this.selectedDebtId()
  });

  nameDebts = rxResource({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._filter.getDebtByUserIdName(request.userId),
  });

 

  filteredDebts = rxResource({
    request: () => ({ id: this.selectedDebt() }),
    loader: ({ request }) => this._filter.getDebtByIdData(request.id!),
  });

}
