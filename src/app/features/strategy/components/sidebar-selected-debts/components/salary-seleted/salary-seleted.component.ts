import { Component, computed, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';
import { StorageService } from '@services/storage.service';

import { format } from '@formkit/tempo';
import { MethodPlanService } from '../../../../../debt/services/method-plan.service';

@Component({
  selector: 'app-salary-seleted',
  imports: [],
  templateUrl: './salary-seleted.component.html',
  styleUrl: './salary-seleted.component.scss',
})
export class SalarySeletedComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _methodPlanService = inject(MethodPlanService);

  includeSalary = signal(false);
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());


  currentMonthNumber = computed(() =>
    format(this.timeNow(), 'M', this.lenguaje())
  );
  seletdUserId = signal(this._storage.getUserId());
  currentMonth = computed(() => format(new Date(), 'MMMM', 'es'));

  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  salary = rxResource<
    apiResponse<Salary>,
    { userId: number; month: number; year: number }
  >({
    request: () => ({
      userId: this.seletdUserId(),
      month: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) => this._methodPlanService.getSalaryByMonth(request.userId, request.month,request.year)
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
