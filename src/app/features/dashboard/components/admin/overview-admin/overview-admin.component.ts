import { Component } from '@angular/core';
import { ExpenseDistributionComponent } from "../admin-components/expense-distribution/expense-distribution.component";


@Component({
  selector: 'app-overview-admin',
  imports: [ExpenseDistributionComponent],
  templateUrl: './overview-admin.component.html',
  styleUrl: './overview-admin.component.scss',
})
export class OverviewAdminComponent {
  
}
