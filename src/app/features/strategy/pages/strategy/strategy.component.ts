import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StorageService } from '../../../../shared/services/storage.service';
import StrategyStateService from '../../services/strategy-state.service';
import { STRATEGY_PAGES } from '../../strategy.routes';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-strategy',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export default class StrategyComponent {
  private router = inject(Router);
  private storage = inject(StorageService);
  private strategyState = inject(StrategyStateService);
  userId = signal<number>(this.storage.getUserId());
  activeTab = STRATEGY_PAGES.SNOWBALL;


  dataStrategy = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => this.strategyState.getPlan(request.userId),
  });

  constructor() {
    effect(() => {
      if (this.dataStrategy.value()?.data?.datajson) {
        const planData = JSON.parse(this.dataStrategy.value()?.data?.datajson!);
        this.strategyState.setSelectedData(planData);
        this.router.navigate(['home/plan']);
      }
    });
  }
}