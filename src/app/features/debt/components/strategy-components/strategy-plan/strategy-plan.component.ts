import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Debt, StrategyMethod } from '@models/debt';
import { SnowballService } from '../../../services/snowball.service';
import { format } from '@formkit/tempo';

export interface StrategyPlanComponentProps {
  method: string;
  currentSalary: number;
  debts: Debt[];
  currentDate: string;
}

@Component({
  selector: 'app-strategy-plan',
  imports: [],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
})
export class StrategyPlanComponent {
  dataProcess = input.required<StrategyMethod>();
  protected readonly _snowballService = inject(SnowballService);

  data = rxResource({
    request: () => ({
      userId: this.dataProcess().userId,
      debtIds: this.dataProcess().debtIds,
    }),
    loader: ({ request }) =>
      this._snowballService.findDebtsByUserWithAmortizations(
        request.userId,
        request.debtIds
      ),
  });


  dataPayload = computed<StrategyPlanComponentProps>(() => ({
    method: this.dataProcess().method,
    currentSalary: this.dataProcess().salaryData as number,
    debts: this.data.value() as Debt[],
    currentDate: format(new Date(), 'YYYY-MM-DD', 'es'),
  }));

  constructor() {
    effect(() => {
      if(this.data.value()){
        console.log('Payload:', this.dataPayload());
        
      }
    });
  }
}
