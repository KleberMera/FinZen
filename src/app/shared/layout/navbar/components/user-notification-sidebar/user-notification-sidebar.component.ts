import { Component, inject, output, signal } from '@angular/core';
import { PushNotificationService } from '@services/push-notification.service';
import { toast } from 'ngx-sonner';
import { NotificationService } from '../../services/notification.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { SwPush } from '@angular/service-worker';
import { environment } from '@environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-notification-sidebar',
  imports: [DatePipe],
  templateUrl: './user-notification-sidebar.component.html',
  styleUrl: './user-notification-sidebar.component.scss',
})
export class UserNotificationSidebarComponent {
  protected readonly _swPush = inject(SwPush);
  protected readonly _notifications = inject(NotificationService);
  protected readonly _storage = inject(StorageService);
  
  closeUserSidebar = output<void>();
  notificationStatus = signal<'enabled' | 'disabled' | 'loading' | 'blocked' | 'granted-no-subscription'>('loading');
  userId = signal<number>(this._storage.getUserId());
  
  ngOnInit() {
    this.checkNotificationStatus();
  }
  
  close() {
    this.closeUserSidebar.emit();
  }
  
  checkNotificationStatus() {
    console.log('checkNotificationStatus');
    this.notificationStatus.set('loading');
    
    if (!('Notification' in window)) {
      console.log('Navegador no soporta notificaciones');
      this.notificationStatus.set('disabled');
      return;
    }
    
    console.log('Estado de permisos:', Notification.permission);
    if (Notification.permission === 'denied') {
      this.notificationStatus.set('blocked');
      return;
    }
    
    const userId = this.userId();
    this._notifications.hasSubscription(userId).subscribe({
      next: (response) => {
        console.log('Respuesta de hasSubscription:', response);
        if (response.hasSubscription === true) {
          this.notificationStatus.set('enabled');
        } else if (Notification.permission === 'granted') {
          this.notificationStatus.set('granted-no-subscription'); // Permisos concedidos, pero sin suscripción
        } else {
          this.notificationStatus.set('disabled'); // Sin permisos y sin suscripción
        }
      },
      error: (error) => {
        console.error('Error al verificar la suscripción:', error);
        this.notificationStatus.set('disabled');
      }
    });
  }
  
  async onNotificationClick() {
    const userId = this.userId();
    
    // Si ya están habilitadas, preguntar si desea desactivarlas
    if (this.notificationStatus() === 'enabled') {
      if (confirm('¿Deseas desactivar las notificaciones?')) {
        this.unsubscribe(userId);
      }
      return;
    }
    
    // Si están bloqueadas, mostrar instrucciones
    if (this.notificationStatus() === 'blocked') {
      alert('Las notificaciones están bloqueadas en tu navegador. Por favor, cambia la configuración de permisos para este sitio en tu navegador.');
      return;
    }
    
    // Solicitar permisos si no están concedidos
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        this.notificationStatus.set('blocked');
        toast.error('Has rechazado los permisos de notificación');
        return;
      }
    }
    
    // Suscribir al usuario
    this.requestSubscription(userId);
  }
  
  private async requestSubscription(userId: number) {
    try {
      const sub = await this._swPush.requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY,
      });
      
      this._notifications.notificationSuscribe(userId, sub).subscribe({
        next: (response) => {
          console.log('Suscripción enviada con éxito:', response);
          toast.success('Notificaciones activadas correctamente');
          this.notificationStatus.set('enabled');
        },
        error: (error) => {
          console.error('Error al enviar la suscripción:', error);
          toast.error('Error al activar las notificaciones');
          this.notificationStatus.set('disabled');
        },
      });
    } catch (error) {
      console.error('Error al solicitar la suscripción:', error);
      toast.error('No se pudieron activar las notificaciones');
      this.notificationStatus.set('disabled');
    }
  }
  
  private unsubscribe(userId: number) {
    // Primero desuscribir del Service Worker
    this._swPush.unsubscribe().then(() => {
      // Luego desuscribir del backend
      this._notifications.unsubscribe(userId).subscribe({
        next: () => {
          toast.success('Notificaciones desactivadas correctamente');
          this.notificationStatus.set('disabled');
        },
        error: (error) => {
          console.error('Error al desactivar las notificaciones:', error);
          toast.error('Error al desactivar las notificaciones');
        }
      });
    }).catch(error => {
      console.error('Error al desuscribir del Service Worker:', error);
      toast.error('Error al desactivar las notificaciones');
    });
  }
  
  notificationsResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => this._notifications.getNotificationsByUserId(request.userId),
  });
}
