import { Component, inject, output, signal } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { NotificationService } from '../../../../../shared/layout/navbar/services/notification.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sidebar-selected-debts',
  imports: [],
  templateUrl: './sidebar-selected-debts.component.html',
  styleUrl: './sidebar-selected-debts.component.scss',
})
export class SidebarSelectedDebtsComponent {
  closeSeletedDebtsSidebar = output<void>();

  close() {
    console.log('closeSeletedDebtsSidebar');

    this.closeSeletedDebtsSidebar.emit();
  }
}
