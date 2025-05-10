import { Component, signal } from '@angular/core';
import { SidebarSelectedDebtsComponent } from '../sidebar-selected-debts/sidebar-selected-debts.component';
import { StrategyPlanComponent } from '../strategy-plan/strategy-plan.component';
import { StrategyMethod } from '@models/debt';
import { DebtData } from '../../types/debt-types';
import { TabSnowballComponent } from "../tab-snowball/tab-snowball.component";
import { TabAvalancheComponent } from "../tab-avalanche/tab-avalanche.component";

@Component({
  selector: 'app-strategy-main',
  imports: [SidebarSelectedDebtsComponent, StrategyPlanComponent, TabSnowballComponent, TabAvalancheComponent],
  templateUrl: './strategy-main.component.html',
  styleUrl: './strategy-main.component.scss',
})
export class StrategyMainComponent {
  activeTab: 'bola-de-nieve' | 'avalancha' | 'seleccion-datos' =
    'bola-de-nieve';
  selectedData = signal<DebtData | null>(null);

  // Manejador para cuando se reciben datos desde el sidebar
  handleSelectedItems(data: DebtData) {
    this.selectedData.set(data);
    console.log('Datos recibidos en StrategyMainComponent:', data);
  }
}
