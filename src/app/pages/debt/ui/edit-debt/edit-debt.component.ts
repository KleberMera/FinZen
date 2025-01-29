import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { apiResponse } from '@models/apiResponse';
import { Debt } from '@models/debt';
import { DebtService } from '../../services/debt.service';
import { StorageService } from '@services/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-debt',
  imports: [DatePipe],
  templateUrl: './edit-debt.component.html',
  styleUrl: './edit-debt.component.scss',
})
export class EditDebtComponent {
  private readonly _debtService = inject(DebtService);
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );

  readonly debts = rxResource<apiResponse<Debt[]>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._debtService.getDebtsByUserIdDebt(request.userId),
  });
}
