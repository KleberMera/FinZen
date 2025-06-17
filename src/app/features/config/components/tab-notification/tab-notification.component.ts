import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Device } from '@models/device';
import { DeviceService } from '../../services/device.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { environment } from '@environments/environment';
import { SwPush } from '@angular/service-worker';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../layout/components/navbar/services/notification.service';
import { DeviceUtilService } from '../../services/device-util.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-tab-notification',
  imports: [ReactiveFormsModule],
  templateUrl: './tab-notification.component.html',
  styleUrl: './tab-notification.component.scss'
})
export default class TabNotificationComponent {
 // Servicios inyectados
 private readonly _deviceService = inject(DeviceService);
 private readonly _storage = inject(StorageService);
 private readonly _notifications = inject(NotificationService);
 private readonly _swPush = inject(SwPush);
 private readonly _router = inject(Router);
 public readonly _deviceUtil = inject(DeviceUtilService);


 // Signals para el estado reactivo
 userId = signal<number>(this._storage.getUserId());

 currentDevice = signal<Device | null>(null);
 notificationStatus = signal<'enabled' | 'disabled' | 'loading' | 'blocked' | 'granted-no-subscription'>('loading');
 subscriptionCount = signal<number>(0);

 // Computed signals para valores derivados
 currentDeviceId = computed(() => this.currentDevice()?.id ?? null);
 devices = computed(() => this.devicesResource.value()?.data ?? []);
 isDeviceSynced = computed(() => this.currentDeviceId() !== null);

 // Resource para cargar dispositivos de forma reactiva
 devicesResource = rxResource({
   request: () => ({ userId: this.userId() }),
   loader: ({ request }) => this._deviceService.getDevicesByUserId(request.userId),
 });


 constructor() {
   // Effect para actualizar el dispositivo actual y el estado de notificaciones
   effect(() => {
     const devices = this.devices();
     const currentDevice = this.findCurrentDevice(devices);
     this.currentDevice.set(currentDevice!);

     if (currentDevice) {
       this.checkNotificationStatus();
       this.loadSubscriptionCount();
     } else {
       this.notificationStatus.set('disabled');
     }
   });
 }

 // Método para identificar el dispositivo actual
 private findCurrentDevice(devices: Device[]): Device | undefined {
   return devices.find(device => this._deviceUtil.isCurrentDevice(device));
 }

 // Cargar el conteo de suscripciones
 private loadSubscriptionCount() {
   this._notifications.countSubscriptions(this.userId()).subscribe({
     next: (response) => this.subscriptionCount.set(response.subscriptions),
     error: (error) => {
       console.error('Error al contar suscripciones:', error);
       this.subscriptionCount.set(0);
     },
   });
 }

 // Verificar el estado de las notificaciones
 private checkNotificationStatus() {
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
  const deviceId = this.currentDeviceId();

// Verificar si el dispositivo actual tiene notificaciones activadas
this._deviceService.hasNotifications(userId, deviceId!).subscribe({
  next: (response) => {
    if (response.hasNotifications!) {
      this.notificationStatus.set('enabled');
    } else {
      // Si no tiene notificaciones en este dispositivo, verificar suscripción general
      this._notifications.hasSubscription(userId).subscribe({
        next: (subResponse) => {
          if (subResponse.hasSubscription) {
            this.notificationStatus.set('granted-no-subscription');
          } else {
            this.notificationStatus.set('disabled'); // No tiene ni notificaciones ni suscripción, permite activar
          }
        },
        error: (error) => {
          console.error('Error al verificar la suscripción:', error);
          this.notificationStatus.set('disabled');
        },
      });
    }
  },
  error: (error) => {
    console.error('Error al verificar notificaciones del dispositivo:', error);
    this.notificationStatus.set('disabled');
  },
});
 }

 // Manejar el clic en el botón de notificaciones
 async onNotificationClick() {
   const userId = this.userId();
   const deviceId = this.currentDeviceId();

   if (!deviceId) {
     toast.error('Dispositivo no reconocido. Por favor, sincroniza primero tu dispositivo.');
     return;
   }

   if (this.notificationStatus() === 'enabled') {
     if (confirm('¿Deseas desactivar las notificaciones?')) {
       this.unsubscribe(userId, deviceId);
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

   this.requestSubscription(userId, deviceId);
 }

 // Solicitar suscripción a notificaciones
 private async requestSubscription(userId: number, deviceId: number) {
   if (this.subscriptionCount() >= 2) {
     toast.error('Ya tienes el máximo de suscripciones permitidas (2)');
     return;
   }

   try {
     const sub = await this._swPush.requestSubscription({
       serverPublicKey: environment.VAPID_PUBLIC_KEY,
     });

     this._notifications.notificationSubscribeWithDevice(userId, deviceId, sub).subscribe({
       next: () => {
         toast.success('Notificaciones activadas correctamente');
         this.notificationStatus.set('enabled');
         this.loadSubscriptionCount();
       },
       error: (error) => {
         console.error('Error al activar las notificaciones:', error);
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

 // Desuscribirse de las notificaciones
 private unsubscribe(userId: number, deviceId: number) {
   this._notifications.unsubscribeWithDevice(userId, deviceId).subscribe({
     next: () => {
       toast.success('Notificaciones desactivadas correctamente');
       this.notificationStatus.set('disabled');
       this.loadSubscriptionCount();
       this.updateDaysBeforeNotifyAll(0);

     },
     error: (error) => {
       console.error('Error al desactivar las notificaciones:', error);
       toast.error('Error al desactivar las notificaciones');
     },
   });
 }




 goToDevices(): void {
  //this._tabService.setActiveTab('dispositivos'); // Cambia el tab a 'dispositivos'
  this._router.navigate(['home/configuracion/dispositivos']); // Navega a la ruta de dispositivos
}



daysBeforeNotifyAllResource = rxResource({
  request: () => ({ userId: this.userId() }),
  loader: ({ request }) => this._notifications.getDaysBeforeNotifyAll(request.userId),
});
isChangingDays: boolean = false;

async updateDaysBeforeNotifyAll(daysBeforeNotifyAll: number) {
  // Si el valor es null o 0, establecer un valor entre 1 y 3
 this.update(daysBeforeNotifyAll);

}

update(daysBeforeNotifyAll: number){
  const promiseNotification = firstValueFrom(this._notifications.updateDaysBeforeNotifyAll(this.userId(), daysBeforeNotifyAll));

  toast.promise(promiseNotification, {
    loading: 'Actualizando días de notificación...',
    success: (response) => {
      this.daysBeforeNotifyAllResource.reload();
      this.isChangingDays = false;
      return response.message;
    },
    error: (error) => {
      console.error('Error al actualizar días de notificación:', error);
      return 'Error al actualizar los días de notificación';
    }
  });
}

// Para incrementar los días de anticipación
incrementDays(): void {
  const currentDays = this.daysBeforeNotifyAllResource.value()?.data?.[0]?.daysBeforeNotify || 0;
  if (currentDays < 7) { // Suponiendo un máximo de 7 días
    this.updateDaysBeforeNotifyAll(currentDays + 1);
  }
}

// Para decrementar los días de anticipación
decrementDays(): void {
  const currentDays = this.daysBeforeNotifyAllResource.value()?.data?.[0]?.daysBeforeNotify || 0;
  if (currentDays > 1) { // No permitir menos de 1 día
    this.updateDaysBeforeNotifyAll(currentDays - 1);
  }
}
}
