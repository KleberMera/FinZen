import { Component, computed, inject, viewChild } from '@angular/core';
import { BreakpointService } from '@services/breakpoint.service';
import { CardAmortizationComponent, CardDetailsComponent, SearchFilterDebtComponent, SkeletonCardDetailTransactionComponent, SkeletonTableAmortizationComponent, TableAmortizationComponent} from '../../components';
import { SkeletonCardAmortizationComponent } from "../../components/skeleton/skeleton-card-amortization/skeleton-card-amortization.component";

const AppComponenteImports = [ SearchFilterDebtComponent, CardAmortizationComponent, CardDetailsComponent, TableAmortizationComponent ];

@Component({
  selector: 'app-list-debt',
  imports: [AppComponenteImports, SkeletonCardDetailTransactionComponent, SkeletonTableAmortizationComponent, SkeletonCardAmortizationComponent],
  templateUrl: './list-debt.component.html',
  styleUrl: './list-debt.component.scss',
})

export default class ListDebtComponent {
  readonly SearchFilterDebtComponent = viewChild(SearchFilterDebtComponent);
  public readonly _screenService = inject(BreakpointService);

  filteredDebts(){
    return this.SearchFilterDebtComponent()?.filteredDebts.value()?.data!;
  }

  loading() {
    return this.SearchFilterDebtComponent()?.filteredDebts.isLoading();
  }

  seletedDebt() {
    return this.SearchFilterDebtComponent()?.selectedDebt();
  }

  // Método para manejar la actualización exitosa
  onUpdateSuccess(): void {
    this.SearchFilterDebtComponent()?.refreshDebtData(); // Refresca los datos
  }

}
