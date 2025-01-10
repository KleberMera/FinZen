import { Component, computed, inject, signal } from '@angular/core';
import { DebtService } from '../../services/debt.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FiltersDebtComponent } from '../../components/filters-debt/filters-debt.component';
export interface Filter {
  name: string;
}

@Component({
  selector: 'app-list-debt',
  imports: [DatePipe, CurrencyPipe, FiltersDebtComponent],
  templateUrl: './list-debt.component.html',
  styleUrl: './list-debt.component.scss',
})
export class ListDebtComponent {
  private readonly _debtService = inject(DebtService);
  protected readonly filters = signal<Filter>({ name: '' });
  protected readonly selectedDebt = signal<boolean>(false);
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  readonly totalMonths = signal<number>(0);

  readonly debts = rxResource({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._debtService.getDebtsByUserId(request.userId),
  });

  onFilterChange(newFilters: { name: string }) {
    this.filters.set(newFilters);
    this.selectedDebt.set(true);
    const data = this.debts.value()?.data || [];
    const amortizations =
      data.find((d) => d.name === newFilters.name)?.amortizations || [];

    this.totalMonths.set(amortizations.length);
  }

  protected readonly filteredDebts = computed(() => {
    const debts = this.debts.value()?.data?? []; 
    console.log(debts);
    
    return debts.filter((trans) => {
      const matchName =
        this.filters().name === '' ||
        trans.name.toLowerCase().includes(this.filters().name.toLowerCase());
      return matchName;
    });
  });

  protected readonly filteredAmortizations = computed(() => {
    const debts = this.debts.value()?.data?? [];
    const selectedDebt = debts.find((d) => d.name === this.filters().name);
    return selectedDebt?.amortizations || [];
  });
}
