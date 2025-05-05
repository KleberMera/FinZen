import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { SnowballService } from '../../../../../services/snowball.service';

@Component({
  selector: 'app-section-recurring',
  imports: [],
  templateUrl: './section-recurring.component.html',
  styleUrl: './section-recurring.component.scss'
})
export class SectionRecurringComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _snowballService = inject(SnowballService);
  seletdUserId = signal(this._storage.getUserId());
  // Recurring transactions
  recurringTransactions = rxResource({
    request: () => ({ userId: this.seletdUserId() }),
    loader: ({ request }) =>
      this._snowballService.getRecurringTransaction(request.userId),
  });

}
