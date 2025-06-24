import { Component, inject, output, signal } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '../../../../../shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { TitleGradient } from '@models/styleClass';
import { SideSheetContentComponent } from '@components/side-sheet';


@Component({
  selector: 'app-user-notification-sidebar',
  imports: [DatePipe, SideSheetContentComponent],
  templateUrl: './user-notification-sidebar.component.html',
  styleUrl: './user-notification-sidebar.component.scss',
})
export class UserNotificationSidebarComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _notifications = inject(NotificationService);
  Title = TitleGradient;
  
  // Señales para controlar los filtros
  protected readonly _filterType = signal<'all' | 'read' | 'unread'>('unread'); // Por defecto no leídas
  protected readonly _filterCategory = signal<'all' | 'debt' | 'transaction'>('all'); // Tipo de notificación

  closeUserSidebar = output<void>();
  notificationRead = output<void>();

  userId = signal<number>(this._storage.getUserId());

  close() {
    this.closeUserSidebar.emit();
  }

  notificationsResource = rxResource({
    request: () => ({
      userId: this.userId(),
      readStatus: this._filterType(),
      type: this._filterCategory(),
    }),
    loader: ({ request }) => {
      return this._notifications.getFilteredNotifications({
        userId: request.userId,
        readStatus: request.readStatus,
        type: request.type,
      });
    },
  });

  setFilter(filterType: 'all' | 'read' | 'unread'): void {
    this._filterType.set(filterType);
  }

  setCategoryFilter(category: 'all' | 'debt' | 'transaction'): void {
    this._filterCategory.set(category);
  }

  // Marcar una notificación específica como leída
  markAsRead(notificationId: number): void {
    this._notifications.markNotificationAsRead(this.userId(), notificationId).subscribe({
      next: () => {
        this.notificationsResource.reload();
        this.notificationRead.emit();
      },
      error: (error) => {
        console.error('Error al marcar notificación como leída:', error);
      }
    });
  }

  // Marcar todas las notificaciones como leídas
  markAllAsRead(): void {
    const notifications = this.notificationsResource.value()?.data || [];
    const unreadNotifications = notifications.filter((n: any) => !n.isRead);
    if (unreadNotifications.length === 0) return;
    const markRequests = unreadNotifications.map((notification: any) => 
      this._notifications.markNotificationAsRead(this.userId(), notification.id)
    );
    forkJoin(markRequests).subscribe({
      next: () => {
        this.notificationsResource.reload();
        this.notificationRead.emit();
      },
      error: (error) => {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
      }
    });
  }

  get currentFilterLabel(): string {
    switch (this._filterType()) {
      case 'all': return 'Todas';
      case 'read': return 'Leídas';
      case 'unread': return 'No leídas';
      default: return 'No leídas';
    }
  }

  get unreadCount(): number {
    const notifications = this.notificationsResource.value() || [];
    return notifications.filter((n: any) => !n.isRead).length;
  }
}