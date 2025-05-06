import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEBT_PAGES } from '../../../debt.routes';
import { SidebarSelectedDebtsComponent } from "../sidebar-selected-debts/sidebar-selected-debts.component";

@Component({
  selector: 'app-strategy-main',
  imports: [SidebarSelectedDebtsComponent],
  templateUrl: './strategy-main.component.html',
  styleUrl: './strategy-main.component.scss',
})
export class StrategyMainComponent {
 activeTab: 'bola-de-nieve'  | 'avalancha' | 'seleccion-datos' = 'bola-de-nieve';
}
