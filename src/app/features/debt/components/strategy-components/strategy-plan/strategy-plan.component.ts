import { Component, input } from '@angular/core';

@Component({
  selector: 'app-strategy-plan',
  imports: [],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss'
})
export class StrategyPlanComponent {

  dataProcess = input.required<any>();


  ngOnInit() {
    console.log('Data process:', this.dataProcess());
  }


}
