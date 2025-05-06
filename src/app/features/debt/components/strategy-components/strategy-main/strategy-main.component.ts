import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEBT_PAGES } from '../../../debt.routes';

@Component({
  selector: 'app-strategy-main',
  imports: [],
  templateUrl: './strategy-main.component.html',
  styleUrl: './strategy-main.component.scss',
})
export class StrategyMainComponent {
  activeTab: 'bola-de-nieve' | 'avalancha' = 'bola-de-nieve';
}
