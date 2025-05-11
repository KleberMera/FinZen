import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { STRATEGY_PAGES } from '../../strategy.routes';
import { filter } from 'rxjs';

@Component({
  selector: 'app-strategy-main',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './strategy-main.component.html',
  styleUrls: ['./strategy-main.component.scss'],
})
export default class StrategyMainComponent {
  activeTab = STRATEGY_PAGES.SNOWBALL;
}
