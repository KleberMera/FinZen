import { Component, computed, inject, signal } from '@angular/core';
import { FilterDebtService } from '../../services/filter-debt.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { FormsModule } from '@angular/forms';
import { SkeletonDebtsComponent } from '../skeleton/skeleton-debts/skeleton-debts.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-filter-debt',
  imports: [FormsModule, SkeletonDebtsComponent, RouterLink],
  templateUrl: './search-filter-debt.component.html',
  styleUrl: './search-filter-debt.component.scss',
})
export class SearchFilterDebtComponent {
  protected readonly selectedDebtId = signal<number>(0);
  protected readonly _filter = inject(FilterDebtService);
  protected readonly _storage = inject(StorageService);

  userId = signal<number>(this._storage.getUserId());

  //Señal computada con el nombre de la deuda seleccionada
  selectedDebt = computed(() => {
  return this.selectedDebtId();
  });

  nameDebts = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => this._filter.getDebtByUserIdName(request.userId),
  });

  filteredDebts = rxResource({
    request: () => ({ id: this.selectedDebt() }),
    loader: ({ request }) => this._filter.getDebtByIdData(request.id!),
  });

  // Método para refrescar los datos
  refreshDebtData(): void {
    console.log('Refrescando datos...');
    this.filteredDebts.reload(); // Vuelve a cargar los datos con la última selección
  }
}
