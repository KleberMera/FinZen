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
  subscriptionCount = signal<number>(0);

  ngOnInit() {
    this.checkNotificationStatus();
    this.loadSubscriptionCount();
  }

  close() {
    this.closeUserSidebar.emit();
  }

  private loadSubscriptionCount() {
    const userId = this.userId();
    this._notifications.countSubscriptions(userId).subscribe({
      next: (response) => {
        this.subscriptionCount.set(response.subscriptions);
      },
      error: (error) => {
        console.error('Error al contar suscripciones:', error);
        this.subscriptionCount.set(0);
      },
    });
  }

  checkNotificationStatus() {
    this.notificationStatus.set('loading');

    if (!('Notification' in window)) {
      this.notificationStatus.set('disabled');
      return;
    }

    if (Notification.permission === 'denied') {
      this.notificationStatus.set('blocked');
      return;
    }

    const userId = this.userId();
    this._notifications.hasSubscription(userId).subscribe({
      next: (response) => {
        if (response.hasSubscription === true) {
          this.notificationStatus.set('enabled');
        } else if (Notification.permission === 'granted') {
          this.notificationStatus.set('granted-no-subscription');
        } else {
          this.notificationStatus.set('disabled');
        }
      },
      error: (error) => {
        console.error('Error al verificar la suscripción:', error);
        this.notificationStatus.set('disabled');
      },
    });
  }

  async onNotificationClick() {
    const userId = this.userId();

    if (this.notificationStatus() === 'enabled') {
      if (confirm('¿Deseas desactivar las notificaciones?')) {
        this.unsubscribe(userId);
      }
      return;
    }

    if (this.notificationStatus() === 'blocked') {
      alert('Las notificaciones están bloqueadas en tu navegador. Por favor, cambia la configuración de permisos.');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        this.notificationStatus.set('blocked');
        toast.error('Has rechazado los permisos de notificación');
        return;
      }
    }

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
          this.loadSubscriptionCount(); // Actualizar el conteo
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
    this._swPush.unsubscribe().then(() => {
      this._notifications.unsubscribe(userId).subscribe({
        next: () => {
          toast.success('Notificaciones desactivadas correctamente');
          this.notificationStatus.set('disabled');
          this.loadSubscriptionCount(); // Actualizar el conteo
        },
        error: (error) => {
          console.error('Error al desactivar las notificaciones:', error);
          toast.error('Error al desactivar las notificaciones');
        },
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
