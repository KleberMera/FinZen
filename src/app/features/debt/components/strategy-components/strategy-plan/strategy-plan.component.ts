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




  constructor() {
    effect(() => {
      if (this.dataProcess()) {
        console.log('Payload:', this.dataProcess());
      }
    });
  }
}
