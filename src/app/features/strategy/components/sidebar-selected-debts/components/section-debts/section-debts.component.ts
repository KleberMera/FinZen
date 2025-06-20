import { Component, computed, effect, inject, signal } from '@angular/core';
import { StorageService } from '../../../../../../shared/services/storage.service';

import { format } from '@formkit/tempo';
import { rxResource } from '@angular/core/rxjs-interop';
import { MethodPlanService } from '../../../../../debt/services/method-plan.service';


@Component({
  selector: 'app-section-debts',
  imports: [],
  templateUrl: './section-debts.component.html',
  styleUrl: './section-debts.component.scss',
})
export class SectionDebtsComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _methodPlanService = inject(MethodPlanService);

  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));

  selectedDebtIds = signal<number[]>([]);

  // Calcular si todos los items están seleccionados
  allDebtsSelected = computed(() => {
    if (!this.debts.value()?.data!.length) return false;
    return this.selectedDebtIds().length === this.debts.value()?.data!.length;
  });

  debts = rxResource({
    request: () => ({ userId: this.seletdUserId() }),
    loader: ({ request }) =>
      this._methodPlanService.getDebtByIdData(request.userId),
  });

  // Al inicializar, pre-seleccionar todas las deudas
  constructor() {
    effect(() => {
      if (this.debts.value()?.data) {
        //this.selectedDebtIds.set(this.debts.data()?.data.map(debt => debt.id) || []);
        this.selectedDebtIds.set(
          this.debts
            .value()
            ?.data?.map((debt) => debt.id)
            .filter((id): id is number => id !== undefined) || []
        );
      }
    });
  }
  toggleAllDebts() {
    if (this.allDebtsSelected()) {
      this.selectedDebtIds.set([]);
    } else {
      this.selectedDebtIds.set(
        this.debts
          .value()
          ?.data?.map((debt) => debt.id)
          .filter((id): id is number => id !== undefined) || []
      );

      //  this.selectedDebtIds.set(this.debts.data()?.data.map(debt => debt.id) || []);
    }
  }

  isDebtSelected(debtId: number): boolean {
    return this.selectedDebtIds().includes(debtId);
  }
  toggleDebt(debtId: number) {
    this.selectedDebtIds.update((ids) => {
      if (ids.includes(debtId)) {
        return ids.filter((id) => id !== debtId);
      } else {
        return [...ids, debtId];
      }
    });
  }
}
