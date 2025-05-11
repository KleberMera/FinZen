import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { STRATEGY_PAGES } from '../../strategy.routes';
import { StorageService } from '@services/storage.service';
import StrategyStateService from '../../services/strategy-state.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-strategy-main',
  imports: [RouterModule],
  templateUrl: './strategy-main.component.html',
  styleUrls: ['./strategy-main.component.scss'],
})
export default class StrategyMainComponent {
  private router = inject(Router);
  private storage = inject(StorageService);
  private strategyState = inject(StrategyStateService);
  userId = signal<number>(this.storage.getUserId());
  activeTab = STRATEGY_PAGES.SNOWBALL;

  // ngOnInit() {
  //   // Verificar si existe un plan guardado
  //   this.strategyState.getPlan(this.userId()).subscribe({
  //     next: (response) => {
  //       if (response.data) {
  //         // Si hay un plan, establecer los datos y navegar al plan
  //         const planData = JSON.parse(response.data.datajson);
  //         this.strategyState.setSelectedData(planData);
  //         this.router.navigate(['home/plan']);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener el plan:', error);
  //     }
  //   });
  // }

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
