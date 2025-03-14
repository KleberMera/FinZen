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
import { SkeletonDebtsComponent } from '../../components/skeleton/skeleton-debts/skeleton-debts.component';
import { Amortization, UpdateStatusDto } from '@models/amortization';
import { AmortizationViewComponent } from "../../components/amortization-view/amortization-view.component";
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-debt',
  imports: [FormsModule, DebtSearchComponent, DebtCardComponent, AmortizationViewComponent],
  templateUrl: './edit-debt.component.html',
  styleUrl: './edit-debt.component.scss',
})
export class EditDebtComponent {
  private readonly _debtService = inject(DebtService);
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  readonly searchTerm = signal('');
  selectedDebt = signal<Debt | null>(null);
  amortizations = signal<Amortization[]>([]);

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

  async onDebtSelect(debt: Debt) {
    this._debtService.getAmortizationsByDebtId(debt.id!).subscribe(
      {
        next: (response) => {
          this.amortizations.set(response.data!);
          this.selectedDebt.set(debt);
        },
        error: (error) => {
          console.error('Error al cargar amortizaciones:', error);
        }
      }
    );
  }

   async onUpdateAmortizations(event: {debtId: number, amortizationIds: number[]}) {
    
    const updateDto: UpdateStatusDto = {
      ids: event.amortizationIds.map(id => Number(id)), // Conversión segura
      status: 'Pagado'
    };

    this._debtService.updateDebtStatus(event.debtId, updateDto).subscribe(
      {
        next: (response) => {
          console.log('Amortizaciones actualizadas:', response);
          this.onBack();
          this.debts.reload();
          toast.success('Pagos actualizados correctamente');
          //this.onDebtSelect(this.selectedDebt());
        }
      }
    );
   
  }

  protected onBack() {
    this.selectedDebt.set(null);
    this.amortizations.set([]);
  }
}
