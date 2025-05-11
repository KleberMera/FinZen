import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { LogoComponent } from '../../icons/logo/logo.component';
import { UserProfileSidebarComponent } from './components/user-profile-sidebar/user-profile-sidebar.component';
import { UserNotificationSidebarComponent } from './components/user-notification-sidebar/user-notification-sidebar.component';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf,
    LogoComponent,
    UserProfileSidebarComponent,
    UserNotificationSidebarComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  sidebarOpen = input(false);
  toggleSidebar = output<void>();
  toggleSidebarUser = output<void>();
  isUserSidebarOpen = signal(false);
  isUserNotificationOpen = signal(false);

  onUserClick() {
    this.isUserSidebarOpen.update((value) => !value);
  }

  onNotificationClick() {
    this.isUserNotificationOpen.update((value) => !value);
  }

  closeUserSidebar() {
    this.isUserSidebarOpen.set(false);
  }

  closeNotificationSidebar() {
    this.isUserNotificationOpen.set(false);
  }
}
