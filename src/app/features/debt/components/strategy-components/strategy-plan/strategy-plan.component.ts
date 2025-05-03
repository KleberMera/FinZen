import { Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StrategyMethod, StrategyPlanComponentProps } from '@models/debt';
import { SnowballService } from '../../../services/snowball.service';
import { format } from '@formkit/tempo';

@Component({
  selector: 'app-strategy-plan',
  imports: [],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
})
export class StrategyPlanComponent {
  dataProcess = input.required<StrategyMethod>();
  protected readonly _snowballService = inject(SnowballService);

  data = rxResource({
    request: () => ({
      userId: this.dataProcess().userId,
      debtIds: this.dataProcess().debtIds,
    }),
    loader: ({ request }) =>
      this._snowballService.findDebtsByUserWithAmortizations(
        request.userId,
        request.debtIds
      ),
  });

  dataPayload = computed<StrategyPlanComponentProps>(() => ({
    method: this.dataProcess().method,
    currentSalary: this.dataProcess().salaryData!,
    currentDate: format(new Date(), 'YYYY-MM-DD', 'es'),
    debts: this.data.value()!,
  }));

  constructor() {
    effect(() => {
      if (this.data.value()) {
        console.log('Payload:', this.dataPayload());
      }
    });
  }
}
