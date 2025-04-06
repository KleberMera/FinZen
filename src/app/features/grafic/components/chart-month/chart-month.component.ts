import { Component, effect, input } from '@angular/core';
import { MonthlyDataItem } from '@models/grafic';

@Component({
  selector: 'app-chart-month',
  imports: [],
  templateUrl: './chart-month.component.html',
  styleUrl: './chart-month.component.scss',
})
export class ChartMonthComponent {
  readonly chartData = input.required<MonthlyDataItem[]>();

  constructor() {
    effect(() => {
      console.log(this.chartData());
    });
  }
}
