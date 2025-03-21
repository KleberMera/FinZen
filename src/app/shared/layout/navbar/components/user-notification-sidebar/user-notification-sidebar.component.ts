import { Component, inject, output, signal } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-notification-sidebar',
  imports: [DatePipe],
  templateUrl: './user-notification-sidebar.component.html',
  styleUrl: './user-notification-sidebar.component.scss',
})
export class UserNotificationSidebarComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _notifications = inject(NotificationService);

  closeUserSidebar = output<void>();

  userId = signal<number>(this._storage.getUserId());

  close() {
    this.closeUserSidebar.emit();
  }

  notificationsResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) =>
      this._notifications.getNotificationsByUserId(request.userId),
  });

   
  //Contador de notificaciones no leídas
  unreadCount= 2


  // Marcar una notificación como leída
  markAllAsRead(): void {
    // event.stopPropagation(); // Evitar propagación para que no abra la notificación
    
    // if (notification.isRead) {
    //   return;
    // }
    
    // this.notificationsService.markAsRead(notification.id).subscribe({
    //   next: () => {
    //     // Actualización optimista: actualizar localmente antes de recibir respuesta del servidor
    //     this.updateNotificationState(notification.id, { isRead: true });
    //   }
    // });
  }
  
}
