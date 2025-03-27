import { Component } from '@angular/core';
import { DashboardHeaderComponent } from "../../components/dashboard-header/dashboard-header.component";
import { CardSalaryComponent } from "../../components/card-salary/card-salary.component";
import { CardMovementsComponent } from "../../components/card-movements/card-movements.component";
import { CardDebtSummaryComponent } from "../../components/card-debt-summary/card-debt-summary.component";
import { CardCategoriesDistributionComponent } from "../../components/card-categories-distribution/card-categories-distribution.component";
import { TimelineTransactionComponent } from "../../components/timeline-transaction/timeline-transaction.component";
import { CalendarComponent } from "../../components/calendar/calendar.component";
import { CardNotificationComponent } from "../../components/card-notification/card-notification.component";
import { CardGoalsComponent } from "../../components/card-goals/card-goals.component";

@Component({
  selector: 'app-overview',
  imports: [DashboardHeaderComponent, CardSalaryComponent, CardMovementsComponent, CardDebtSummaryComponent, CardCategoriesDistributionComponent, TimelineTransactionComponent, CalendarComponent, CardNotificationComponent, CardGoalsComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export default class OverviewComponent {

}
