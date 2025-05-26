import { Component } from '@angular/core';
import { ExpenseDistributionComponent } from "../admin-components/expense-distribution/expense-distribution.component";
import { ExpenseDistributionTrendComponent } from "../admin-components/expense-distribution-trend/expense-distribution-trend.component";
import { TransactionStaticsComponent } from "../admin-components/transaction-statics/transaction-statics.component";


@Component({
  selector: 'app-overview-admin',
  imports: [ExpenseDistributionComponent, ExpenseDistributionTrendComponent, TransactionStaticsComponent],
  templateUrl: './overview-admin.component.html',
  styleUrl: './overview-admin.component.scss',
})
export class OverviewAdminComponent {
  
}
