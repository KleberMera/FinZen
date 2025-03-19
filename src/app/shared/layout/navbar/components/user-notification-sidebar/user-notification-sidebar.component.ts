import { Component, inject, output, signal } from '@angular/core';
import { PushNotificationService } from '@services/push-notification.service';
import { toast } from 'ngx-sonner';
import { NotificationService } from '../../services/notification.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';

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

    private readonly pushService = inject(PushNotificationService);
    protected readonly _notifications = inject(NotificationService);
    protected readonly _storage = inject(StorageService);

    userId = signal<number>(this._storage.getUserId());
  
  
    async onNotificationClick() {
      const success = await this.pushService.requestSubscription();
      if (success) {
        console.log(success);
        
        console.log('Notificaciones activadas correctamente');
        toast.success('Notificaciones activadas correctamente');
      } else {
        console.error('No se pudieron activar las notificaciones');
        toast.error('No se pudieron activar las notificaciones');
      }
    }


    notificationsResource = rxResource({
      request: () => ({ userId: this.userId() }),
      loader: ({ request }) => this._notifications.getNotificationsByUserId(request.userId),
    });

   
}
