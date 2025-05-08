import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StrategyMethod, StrategyPlanComponentProps } from '@models/debt';

import { format } from '@formkit/tempo';
import { SnowballService } from '../../../debt/services/snowball.service';
import { DebtDataService } from '../../services/debt-data.service';
import { NgClass } from '@angular/common';
import { PaymentPlanSummaryComponent } from '../payment-plan-summary/payment-plan-summary.component';
import { InsufficientFundsWarningComponent } from '../insufficient-funds-warning/insufficient-funds-warning.component';
import { PaymentTableTabComponent } from '../payment-table-tab/payment-table-tab.component';
import { ChartTabComponent } from '../chart-tab/chart-tab.component';
import { DistributionTabComponent } from '../distribution-tab/distribution-tab.component';
import { CalendarTabComponent } from '../calendar-tab/calendar-tab.component';
import { SummaryCardsComponent } from '../summary-cards/summary-cards.component';
import { DebtData } from '../../types/debt-types';

@Component({
  selector: 'app-strategy-plan',
  imports: [
    NgClass,
    PaymentPlanSummaryComponent,
    InsufficientFundsWarningComponent,
    PaymentTableTabComponent,
    ChartTabComponent,
    DistributionTabComponent,
    CalendarTabComponent,
    SummaryCardsComponent,
  ],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
})
export class StrategyPlanComponent implements OnInit {
  dataProcess = input.required<DebtData>();
  protected readonly _snowballService = inject(SnowballService);
  private debtDataService = inject(DebtDataService);

  // Tab management
  activeTab = 'table';

  ngOnInit(): void {
    console.log('StrategyPlanComponent.ngOnInit');
    this.debtDataService.setData(this.dataProcess());
  }

  // Access signals directly from the service
  get debtData() {
    return this.debtDataService.debtData;
  }

  get insufficientFunds() {
    return this.debtDataService.insufficientFunds;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
