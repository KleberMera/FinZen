import { Component, inject, output } from '@angular/core';
import { PushNotificationService } from '@services/push-notification.service';
import { toast } from 'ngx-sonner';

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
}
