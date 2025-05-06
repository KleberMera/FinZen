import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEBT_PAGES } from '../../../debt.routes';
import { SidebarSelectedDebtsComponent } from "../sidebar-selected-debts/sidebar-selected-debts.component";
import { StrategyPlanComponent } from "../strategy-plan/strategy-plan.component";
import { StrategyMethod } from '@models/debt';

@Component({
  selector: 'app-strategy-main',
  imports: [SidebarSelectedDebtsComponent, StrategyPlanComponent],
  templateUrl: './strategy-main.component.html',
  styleUrl: './strategy-main.component.scss',
})
export class StrategyMainComponent {
 activeTab: 'bola-de-nieve'  | 'avalancha' | 'seleccion-datos' = 'bola-de-nieve';
 selectedData = signal<StrategyMethod | null>(null);

   // Manejador para cuando se reciben datos desde el sidebar
   handleSelectedItems(data: StrategyMethod) {
    this.selectedData.set(data);
    console.log('Datos recibidos en StrategyMainComponent:', data);
  }
}
