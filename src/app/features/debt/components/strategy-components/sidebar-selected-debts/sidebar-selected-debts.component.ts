import {
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { SnowballService } from '../../../services/snowball.service';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';

@Component({
  selector: 'app-sidebar-selected-debts',
  imports: [],
  templateUrl: './sidebar-selected-debts.component.html',
  styleUrl: './sidebar-selected-debts.component.scss',
})
export class SidebarSelectedDebtsComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);

  closeSeletedDebtsSidebar = output<void>();
  selectedItems = output<{
    salary: boolean;
    debtIds: number[];
    userId: number;
    salaryData?: number;
  }>();

  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));

  // Estados para elementos seleccionados
  includeSalary = signal(true);
  selectedDebtIds = signal<number[]>([]);

  // Calcular si todos los items están seleccionados
  allDebtsSelected = computed(() => {
    if (!this.debts.value()?.data!.length) return false;
    return this.selectedDebtIds().length === this.debts.value()?.data!.length;
  });

  salary = rxResource<
    apiResponse<Salary>,
    { userId: number; currentMonth: string }
  >({
    request: () => ({
      userId: this.seletdUserId(),
      currentMonth: this.capitalizeFirstLetter(this.currentMonth()),
    }),
    loader: ({ request }) =>
      this._snowballService.getSalaryByMonth(
        request.userId,
        request.currentMonth
      ),
  });

  debts = rxResource({
    request: () => ({ userId: this.seletdUserId() }),
    loader: ({ request }) =>
      this._snowballService.getDebtByIdData(request.userId),
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

  close() {
    this.closeSeletedDebtsSidebar.emit();
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  toggleSalary() {
    this.includeSalary.update((val) => !val);
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

  isDebtSelected(debtId: number): boolean {
    return this.selectedDebtIds().includes(debtId);
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

  applySelection() {
    const selectionData = {
      salary: this.includeSalary(),
      debtIds: this.selectedDebtIds(),
      userId: this.seletdUserId(),
      ...(this.includeSalary() && {
        salaryData: this.salary.value()?.data?.salary_amount,
      }),
    };
    this.selectedItems.emit(selectionData);

    this.close();
  }
}
