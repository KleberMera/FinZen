import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { STRATEGY_PAGES } from '../../strategy.routes';

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
