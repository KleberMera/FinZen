import { Component, input, output, signal, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserProfileSidebarComponent } from './components/user-profile-sidebar/user-profile-sidebar.component';
import { UserNotificationSidebarComponent } from './components/user-notification-sidebar/user-notification-sidebar.component';
import { LogoComponent } from '@icons/logo/logo.component';
import { ProfileImageService } from '../../../shared/services/profile-image.service';
import { StorageService } from '../../../shared/services/storage.service';
import { SideSheetComponent, SideSheetContentComponent } from '../../../shared/components/side-sheet';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    LogoComponent,
    UserProfileSidebarComponent,
    UserNotificationSidebarComponent,
    SideSheetComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  sidebarOpen = input(false);
  toggleSidebar = output<void>();
  protected readonly profileImageService = inject(ProfileImageService);
  private readonly storageService = inject(StorageService);
  toggleSidebarUser = output<void>();
  isUserSidebarOpen = signal(false);
  isUserNotificationOpen = signal(false);
  isDarkMode = signal(false);

  constructor() {
    // Check for saved theme preference or use system preference
    const savedTheme = this.storageService.getTheme();
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
      this.updateTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
      this.updateTheme(prefersDark ? 'dark' : 'light');
    }
  }

  onUserClick() {
    this.isUserSidebarOpen.update((value) => !value);
  }



  closeUserSidebar() {
    this.isUserSidebarOpen.set(false);
  }

  closeNotificationSidebar() {
    this.isUserNotificationOpen.set(false);
  }

  toggleTheme() {
    const newTheme = this.isDarkMode() ? 'light' : 'dark';
    this.isDarkMode.set(!this.isDarkMode());
    this.updateTheme(newTheme);
    this.storageService.setTheme(newTheme);
  }

  private updateTheme(theme: string) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
