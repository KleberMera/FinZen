import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { apiResponse } from '@models/apiResponse';
import { Debt } from '@models/debt';
import { DebtService } from '../../services/debt.service';
import { StorageService } from '@services/storage.service';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebtSearchComponent } from '../../components/debt-search/debt-search.component';
import { DebtCardComponent } from '../../components/debt-card/debt-card.component';

@Component({
  selector: 'app-edit-debt',
  imports: [FormsModule, DebtSearchComponent, DebtCardComponent],
  templateUrl: './edit-debt.component.html',
  styleUrl: './edit-debt.component.scss',
})
export class EditDebtComponent {
  private readonly _debtService = inject(DebtService);
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  readonly searchTerm = signal('');

  readonly debts = rxResource<apiResponse<Debt[]>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._debtService.getDebtsByUserIdDebt(request.userId),
  });

  // Computed para las sugerencias del buscador
  protected debtNames = computed(() => {
    const response = this.debts.value();
    return response?.data?.map((debt) => debt.name) || [];
  });

  // Computed para filtrar las deudas
  protected filteredDebts = computed(() => {
    const response = this.debts.value();
    if (!response) return null;

    const term = this.searchTerm().toLowerCase();
    if (!term) return response;

    return {
      ...response,
      data: response.data?.filter((debt) =>
        debt.name.toLowerCase().includes(term)
      ),
    };
  });
}
