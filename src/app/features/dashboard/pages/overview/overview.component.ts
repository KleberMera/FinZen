import { Component, inject, signal } from '@angular/core';
import { DashboardHeaderComponent } from "../../components/dashboard-header/dashboard-header.component";
import { CardSalaryComponent } from "../../components/card-salary/card-salary.component";
import { CardMovementsComponent } from "../../components/card-movements/card-movements.component";
import { StorageService } from '@services/storage.service';
import { CardMonthSummaryComponent } from "../../components/card-month-summary/card-month-summary.component";
import { OverviewAdminComponent } from "../../components/admin/overview-admin/overview-admin.component";

@Component({
  selector: 'app-overview',
  imports: [DashboardHeaderComponent, CardSalaryComponent, CardMovementsComponent, CardMonthSummaryComponent, OverviewAdminComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export default class OverviewComponent {
  protected readonly _storageService = inject(StorageService);

  rolIdUser = signal<number>(this._storageService.getRole()!);

}
