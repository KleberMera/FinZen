import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StrategyMethod } from '@models/debt';
import { SnowballService } from '../../../services/snowball.service';

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

  constructor() {}
}
