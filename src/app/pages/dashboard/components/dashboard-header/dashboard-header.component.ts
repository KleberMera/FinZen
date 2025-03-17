import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { BalanceService } from '../../services/balance.service';
import { CardDebtCategoryComponent } from "../card-debt-category/card-debt-category.component";
import { AdvancedGraficsComponent } from "../advanced-grafics/advanced-grafics.component";
import { format } from '@formkit/tempo';

@Component({
  selector: 'app-dashboard-header',
  imports: [CurrencyPipe, TitleCasePipe, CommonModule, CardDebtCategoryComponent, AdvancedGraficsComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  protected readonly storage = inject(StorageService);
  private readonly _balanceService = inject(BalanceService);
  name = signal<string>(this.storage.getName());
  userId = signal<number>(this.storage.getUserId());
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = signal<any>(format(this.timeNow(), 'MM', this.lenguaje()));
  currenMonthName = signal<any>(format(this.timeNow(), 'MMMM', this.lenguaje()));
  currentYear = signal<any>(format(this.timeNow(), 'YYYY', this.lenguaje()));
  previousMonth = signal<any>(this.currentMonth() - 1);
  previousYear = signal<any>(this.currentYear());



  balance = rxResource({
    request: () => ({ userId: this.userId() , currentMonth: this.currentMonth(), currentYear: this.currentYear(), previousMonth: this.previousMonth(), previousYear: this.previousYear() }),
    loader: ({ request }) =>
      this._balanceService.getBalanceByUserId(request.userId , request.currentMonth, request.currentYear, request.previousMonth, request.previousYear),
  });
}
