import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { BalanceService } from '../../services/balance.service';
import { format } from '@formkit/tempo';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-card-month-summary',
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './card-month-summary.component.html',
  styleUrl: './card-month-summary.component.scss'
})
export class CardMonthSummaryComponent {
  protected readonly storage = inject(StorageService);
  private readonly _balanceService = inject(BalanceService);
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
