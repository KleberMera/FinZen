import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SnowballService } from '../../../debt/services/snowball.service';
import { DebtDataService } from '../../services/debt-data.service';
import { DebtCalculatorService } from '../../services/debt-calculator.service';
import { NgClass } from '@angular/common';
import { PaymentPlanSummaryComponent } from '../payment-plan-summary/payment-plan-summary.component';
import { InsufficientFundsWarningComponent } from '../insufficient-funds-warning/insufficient-funds-warning.component';
import { PaymentTableTabComponent } from '../payment-table-tab/payment-table-tab.component';
import { ChartTabComponent } from '../chart-tab/chart-tab.component';
import { DistributionTabComponent } from '../distribution-tab/distribution-tab.component';
import { CalendarTabComponent } from '../calendar-tab/calendar-tab.component';
import { SummaryCardsComponent } from '../summary-cards/summary-cards.component';
import { DebtDetailsComponent } from '../debt-details/debt-details.component';
import StrategyStateService from '../../services/strategy-state.service';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';

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
  ],
  templateUrl: './strategy-plan.component.html',
  styleUrl: './strategy-plan.component.scss',
})
export default class StrategyPlanComponent implements OnInit {
  protected readonly _snowballService = inject(SnowballService);
  private debtDataService = inject(DebtDataService);
  private strategyState = inject(StrategyStateService);
  protected readonly _storage = inject(StorageService);
  userId = signal<number>(this._storage.getUserId());
  private router = inject(Router);
  paymentPlan = this.debtDataService.paymentPlan;
  processedDebts = this.debtDataService.processedDebts;
  // Tab management
  activeTab = 'table';

  ngOnInit(): void {
    // Si no hay datos seleccionados, intentar obtener el plan guardado
    if (!this.strategyState.selectedData()) {
      this.strategyState.getPlan(this.userId()).subscribe({
        next: (response) => {
          if (response.data) {
            // Si hay un plan guardado, establecer los datos
            const planData = JSON.parse(response.data.datajson);
            this.strategyState.setSelectedData(planData);
            this.debtDataService.setData(planData);
          } else {
            // Si no hay plan guardado, redirigir a la selección
            this.router.navigate(['home/estrategia/bola-de-nieve']);
          }
        },
        error: (error) => {
          console.error('Error al obtener el plan:', error);
          this.router.navigate(['home/estrategia/bola-de-nieve']);
        }
      });
      return;
    }

    // Si hay datos seleccionados, usarlos
    const data = this.strategyState.selectedData()!;
    this.debtDataService.setData(data);
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

    const data = this.debtDataService.debtData();

    this.strategyState.createStrategy(this.userId(), data).subscribe({
      next: (res) => {
        toast.success(res.message);
      },
    });
  }


  generateNewPlan(): void {
    //Eliminar plan actual y crear uno nuevo
  
  }
}
