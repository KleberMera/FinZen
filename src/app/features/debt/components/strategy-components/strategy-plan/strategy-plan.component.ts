import { Component, effect, input } from '@angular/core';
import { StrategyMethod } from '@models/debt';

@Component({
  selector: 'app-strategy-plan',
  imports: [],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
})
export class StrategyPlanComponent {
  dataProcess = input.required<StrategyMethod>();


  constructor() {
    effect(() => {
      if (this.dataProcess()) {
        console.log('Payload:', this.dataProcess());
      }
    });
  }
}
