import { Component, output } from '@angular/core';

@Component({
  selector: 'app-user-notification-sidebar',
  imports: [],
  templateUrl: './user-notification-sidebar.component.html',
  styleUrl: './user-notification-sidebar.component.scss',
})
export class UserNotificationSidebarComponent {
  closeUserSidebar = output<void>();

  close() {
    this.closeUserSidebar.emit();
  }
}
