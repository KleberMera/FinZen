import { Component, computed, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { FiltersDebtComponent } from '../../components/filters-debt/filters-debt.component';
import { TableAmortizationComponent } from "../../components/table-amortization/table-amortization.component";
import { apiResponse } from '@models/apiResponse';
import { Debt } from '@models/debt';
import { SkeletonDebtsComponent } from "../../components/skeleton-debts/skeleton-debts.component";

export interface Filter {
  name: string;
}

@Component({
  selector: 'app-list-debt',
  imports: [FiltersDebtComponent, TableAmortizationComponent, SkeletonDebtsComponent],
  templateUrl: './list-debt.component.html',
  styleUrl: './list-debt.component.scss',
})
export class ListDebtComponent {
  private readonly _debtService = inject(DebtService);
  protected readonly filters = signal<Filter>({ name: '' });
  protected readonly selectedDebt = signal<boolean>(false);
  private readonly seletedUser = signal<number>(inject(StorageService).getUserId());
 
  readonly debts = rxResource<apiResponse<Debt[]>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._debtService.getDebtsByUserId(request.userId),
  });

  onFilterChange(newFilters: { name: string }) {
    this.filters.set(newFilters);
    this.selectedDebt.set(true);
  }

  protected readonly filteredDebts = computed(() => {
    const debts = this.debts.value()?.data ?? [];
    return debts.filter((trans) => {
      const matchName =
        this.filters().name === '' ||
        trans.name.toLowerCase().includes(this.filters().name.toLowerCase());
      return matchName;
    });

  });

  protected readonly filteredAmortizations = computed(() => {
    const debts = this.debts.value()?.data ?? [];
    const selectedDebt = debts.find((d) => d.name === this.filters().name);
    return selectedDebt?.amortizations || [];
  });
}
