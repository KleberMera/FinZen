import { Component, input } from '@angular/core';
import { StrategyMethod } from '@models/debt';

@Component({
  selector: 'app-strategy-plan',
  imports: [],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
})
export class StrategyPlanComponent {
  dataProcess = input.required<StrategyMethod>();

  ngOnInit() {
    console.log('Data process:', this.dataProcess());
  }
}
