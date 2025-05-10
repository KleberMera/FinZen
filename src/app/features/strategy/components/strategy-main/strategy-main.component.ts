import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StrategyPlanComponent } from '../strategy-plan/strategy-plan.component';
import { StrategyMethod } from '@models/debt';
import { DebtData } from '../../types/debt-types';
import { STRATEGY_PAGES } from '../../strategy.routes';

@Component({
  selector: 'app-strategy-main',
  standalone: true,
  imports: [RouterModule, StrategyPlanComponent ],
  templateUrl: './strategy-main.component.html',
  styleUrls: ['./strategy-main.component.scss'],  
})
export default class StrategyMainComponent {
  activeTab = STRATEGY_PAGES.SNOWBALL;
  selectedData = signal<DebtData | null>(null);

  // Manejador para cuando se reciben datos desde el sidebar
  handleSelectedItems(data: DebtData) {
    this.selectedData.set(data);
    console.log('Datos recibidos en StrategyMainComponent:', data);
  }
}
