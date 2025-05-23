import { Component, inject, signal } from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { GraficsService } from '../../../services/grafics.service';

@Component({
  selector: 'app-overview-admin',
  imports: [],
  templateUrl: './overview-admin.component.html',
  styleUrl: './overview-admin.component.scss',
})
export class OverviewAdminComponent {
  protected readonly _graficsService = inject(GraficsService);
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = signal<any>(format(this.timeNow(), 'MM', this.lenguaje()));
  currenMonthName = signal<any>(format(this.timeNow(), 'MMMM', this.lenguaje()));
  currentYear = signal<any>(format(this.timeNow(), 'YYYY', this.lenguaje()));

  expenseDistribution = rxResource({
    request: () => ({ month: this.currentMonth(), year: this.currentYear() }),
    loader: ({ request }) => this._graficsService.getExpenseDistributionByMonth(request.month, request.year)  
  });
}
