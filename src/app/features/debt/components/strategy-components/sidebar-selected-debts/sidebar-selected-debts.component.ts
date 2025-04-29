import { Component, computed, inject, output, signal } from '@angular/core';
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
  closeSeletedDebtsSidebar = output<void>();
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);
  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));

  salary = rxResource<apiResponse<Salary>, { userId: number; currentMonth: string }>({
    request: () => ({ userId: this.seletdUserId(), currentMonth: this.capitalizeFirstLetter(this.currentMonth())}),
    loader: ({ request }) => this._snowballService.getSalaryByMonth(request.userId, request.currentMonth)});

  debts = rxResource({
    request: () => ({ userId: this.seletdUserId() }),
    loader: ({ request }) => this._snowballService.getDebtByIdData(request.userId)});

  close() {
    this.closeSeletedDebtsSidebar.emit();
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  
}
