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
import { NgClass, NgIf } from '@angular/common';
import { PaymentPlanSummaryComponent } from '../payment-plan-summary/payment-plan-summary.component';
import { InsufficientFundsWarningComponent } from '../insufficient-funds-warning/insufficient-funds-warning.component';
import { PaymentTableTabComponent } from '../payment-table-tab/payment-table-tab.component';
import { ChartTabComponent } from '../chart-tab/chart-tab.component';
import { DistributionTabComponent } from '../distribution-tab/distribution-tab.component';
import { CalendarTabComponent } from '../calendar-tab/calendar-tab.component';
import { SummaryCardsComponent } from '../summary-cards/summary-cards.component';
import { DebtData } from '../../types/debt-types';
import { DebtDetailsComponent } from "../debt-details/debt-details.component";
import { DebtCalculatorService } from '../../services/debt-calculator.service';

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
    DebtDetailsComponent,
    NgIf

],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
  
})
export class StrategyPlanComponent implements OnInit {
  dataProcess = input.required<DebtData>();
  protected readonly _snowballService = inject(SnowballService);
  private debtDataService = inject(DebtDataService);
  // Access signals directly from the service
  private calculatorService = inject(DebtCalculatorService)
  paymentPlan = this.debtDataService.paymentPlan
  processedDebts = this.debtDataService.processedDebts
  // Tab management
  activeTab = 'table';

  ngOnInit(): void {
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


  saveCurrentPlan(): void {
    // Create a data object with all the necessary information
    const planData = {
      debtData: this.debtData(),
      processedDebts: this.processedDebts(),
      paymentPlan: this.paymentPlan(),
      statistics: {
        totalOriginalAmount: this.calculatorService.calculateOriginalDebtTotal(this.processedDebts()),
        totalPaid: this.calculatorService.calculateTotalPaid(this.paymentPlan()),
        totalInterestPaid: this.calculatorService.calculateTotalInterestPaid(this.paymentPlan()),
        monthsToFreedom: this.paymentPlan().length,
        freedomDate: this.paymentPlan()[this.paymentPlan().length - 1]?.date || "N/A",
      },
    }

    console.log(planData);
    

   
  }



  /**
   * Generate a new payment plan
   */
  generateNewPlan(): void {
    
  }


}
