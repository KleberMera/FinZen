import { Component, computed, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';
import { StorageService } from '@services/storage.service';

import { format } from '@formkit/tempo';
import { SnowballService } from '../../../../../debt/services/snowball.service';

@Component({
  selector: 'app-salary-seleted',
  imports: [],
  templateUrl: './salary-seleted.component.html',
  styleUrl: './salary-seleted.component.scss',
})
export class SalarySeletedComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);

  includeSalary = signal(false);

  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));
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

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  toggleSalary() {
    this.includeSalary.update((val) => !val);
  }

  constructor(){

  }
  

 
}
