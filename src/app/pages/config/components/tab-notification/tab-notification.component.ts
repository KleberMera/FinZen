import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Device } from '@models/device';
import { DeviceService } from '../../services/device.service';
import { StorageService } from '@services/storage.service';
import { apiResponse } from '@models/apiResponse';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../shared/layout/navbar/services/notification.service';
import { SwPush } from '@angular/service-worker';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-tab-notification',
  imports: [],
  templateUrl: './tab-notification.component.html',
  styleUrl: './tab-notification.component.scss'
})
export class TabNotificationComponent {
 // Servicios inyectados
 private readonly _http = inject(HttpClient);
 private readonly _deviceService = inject(DeviceService);
 private readonly _storage = inject(StorageService);
 private readonly _notifications = inject(NotificationService);
 private readonly _swPush = inject(SwPush);
 
 // Datos del usuario y dispositivo
 userId = signal<number>(this._storage.getUserId());
 currentUserAgent = navigator.userAgent;
 currentDeviceId = signal<number | null>(null);
 
 // Estados de notificación
 notificationStatus = signal<'enabled' | 'disabled' | 'loading' | 'blocked' | 'granted-no-subscription'>('loading');
 subscriptionCount = signal<number>(0);
 
 // Resource para obtener los dispositivos
 devicesResource = rxResource({
   request: () => ({ userId: this.userId() }),
   loader: ({ request }) => this._deviceService.getDevicesByUserId(request.userId),
 });

 // Resource para obtener notificaciones
 notificationsResource = rxResource({
   request: () => ({ userId: this.userId() }),
   loader: ({ request }) => this._notifications.getNotificationsByUserId(request.userId),
 });

 constructor() {
   effect(() => {
     // Carga inicial de dispositivos
     //this.devicesResource.reload();
     
     // Cuando los dispositivos están cargados, buscar el dispositivo actual
     const devices = this.devicesResource.value()?.data;
     if (devices) {
       const currentDevice = this.findCurrentDevice(devices);
       if (currentDevice && currentDevice.id) {
         console.log('Dispositivo actual encontrado:', currentDevice);
         this.currentDeviceId.set(currentDevice.id);
         
         // Verificar estado de notificaciones
         this.checkNotificationStatus();
         this.loadSubscriptionCount();
       } else {
         console.log('Dispositivo actual no encontrado entre los registrados');
         this.notificationStatus.set('disabled');
       }
     }
   });
 }

 // Método para encontrar el dispositivo actual entre la lista de dispositivos
 private findCurrentDevice(devices: Device[]): Device | undefined {
   return devices.find(device => 
     device.userAgent === this.currentUserAgent &&
     device.os === (navigator.platform || 'Unknown') &&
     device.browser === this.getBrowserInfo() &&
     device.isMobile === /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
     device.brand === (navigator.vendor || 'Unknown') &&
     device.model === (navigator.platform || 'Unknown')
   );
 }

 private loadSubscriptionCount() {
   const userId = this.userId();
   this._notifications.countSubscriptions(userId).subscribe({
     next: (response) => {
      console.log('Suscripciones actuales:', response.subscriptions);
      
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

 async requestSubscription(userId: number, deviceId: number) {
   if (this.subscriptionCount() >= 2) {
     toast.error('Ya tienes el máximo de suscripciones permitidas (2)');
     return;
   }

   try {
     const sub = await this._swPush.requestSubscription({
       serverPublicKey: environment.VAPID_PUBLIC_KEY,
     });

     // Ahora incluimos el deviceId en la suscripción
     this._notifications.notificationSubscribeWithDevice(userId, deviceId, sub).subscribe({
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

 private unsubscribe(userId: number, deviceId: number) {
   this._swPush.unsubscribe().then(() => {
     // Incluir el deviceId en la desuscripción
     this._notifications.unsubscribeWithDevice(userId, deviceId).subscribe({
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

 // Verificar si hay notificaciones activas para el dispositivo
 hasNotifications(userId: number, deviceId: number) {
   const url = `${environment.apiUrl}/device/has-notifications/${deviceId}/${userId}`;
   return this._http.get<apiResponse<boolean>>(url);
 }

 // Método auxiliar para detectar el navegador
 private getBrowserInfo(): string {
   const userAgent = navigator.userAgent.toLowerCase();
   let browser = 'Unknown';
   if (/firefox/.test(userAgent)) browser = 'Firefox';
   else if (/edg/.test(userAgent)) browser = 'Edge';
   else if (/chrome/.test(userAgent)) browser = 'Chrome';
   else if (/safari/.test(userAgent)) browser = 'Safari';
   else if (/opera/.test(userAgent)) browser = 'Opera';
   return browser;
 }

 isCurrentDevice(device: any): boolean {
  return (
    device.userAgent === this.currentUserAgent &&
    device.os === (navigator.platform || 'Unknown') &&
    device.browser === this.getBrowserInfo() &&
    device.isMobile === /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
    device.brand === (navigator.vendor || 'Unknown') &&
    device.model === (navigator.platform || 'Unknown')
  );
}
}
