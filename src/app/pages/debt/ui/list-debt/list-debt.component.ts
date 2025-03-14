import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { BreakpointService } from '@services/breakpoint.service';
import { CardAmortizationComponent, CardDetailsComponent, SearchFilterDebtComponent, TableAmortizationComponent} from '../../components';

const AppComponenteImports = [ SearchFilterDebtComponent, CardAmortizationComponent, CardDetailsComponent, TableAmortizationComponent ];

@Component({
  selector: 'app-list-debt',
  imports: [AppComponenteImports],
  templateUrl: './list-debt.component.html',
  styleUrl: './list-debt.component.scss',
})

export class ListDebtComponent {
  readonly SearchFilterDebtComponent = viewChild(SearchFilterDebtComponent);
  public readonly _screenService = inject(BreakpointService);

  filteredDebts = computed(() => {
    const debts =
      this.SearchFilterDebtComponent()?.filteredDebts.value()?.data!;
    return debts;
  });

  loading() {
    return this.SearchFilterDebtComponent()?.filteredDebts.isLoading();
  }

  seletedDebt() {
    return this.SearchFilterDebtComponent()?.selectedDebt();
  }


}
