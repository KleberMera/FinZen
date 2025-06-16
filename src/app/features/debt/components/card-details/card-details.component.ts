import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { Debt } from '@models/debt';
import { DebtService } from '../../services/debt.service';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-card-details',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent {
  readonly debts = input.required<Debt[]>();
  protected readonly _debtService = inject(DebtService);


  hasPayments(debt: Debt): boolean {
    return debt.totalPaidAmount > 0;
  }

  deleteDebt(debt: Debt) {
 
    const promise = firstValueFrom(
      this._debtService.deleteDebt(debt.id!));

      toast.promise(promise, {
        loading: 'Eliminando deuda...',
        success: (data) => {
     
           return data.message
        },
      
      });
  }
}
