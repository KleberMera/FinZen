import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { BalanceService } from '../../services/balance.service';
import { CardDebtCategoryComponent } from "../card-debt-category/card-debt-category.component";
import { AdvancedGraficsComponent } from "../advanced-grafics/advanced-grafics.component";

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

  balance = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) =>
      this._balanceService.getBalanceByUserId(request.userId),
  });
}
