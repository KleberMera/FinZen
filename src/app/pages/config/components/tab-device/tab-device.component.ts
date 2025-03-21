import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DeviceService } from '../../services/device.service';
import { StorageService } from '@services/storage.service';
import { Device } from '@models/device';

@Component({
  selector: 'app-tab-device',
  imports: [],
  templateUrl: './tab-device.component.html',
  styleUrl: './tab-device.component.scss',
})
export class TabDeviceComponent {
  protected readonly _deviceService = inject(DeviceService);
  protected readonly _storage = inject(StorageService);
  userId = signal<number>(this._storage.getUserId());
  devicesResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) =>
      this._deviceService.getDevicesByUserId(request.userId),
  });

  isCurrentDeviceRegistered(): boolean {
    const devices = this.devicesResource.value()?.data || [];
    return devices.some((device) => 
      device.userAgent === this.currentUserAgent &&
      device.os === (navigator.platform || 'Unknown') &&
      device.browser === this.getBrowserInfo() &&
      device.isMobile === /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
      device.brand === (navigator.vendor || 'Unknown') &&
      device.model === (navigator.platform || 'Unknown')
    );
  }

  currentUserAgent: string = navigator.userAgent;

  async synchronizeDevice() {
    console.log('Sincronizando dispositivo...');
    console.log(this.currentUserAgent);

    const deviceData: Device = {
      userAgent: this.currentUserAgent,
      os: navigator.platform || 'Unknown',
      browser: this.getBrowserInfo(),
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      brand: navigator.vendor || 'Unknown',
      model: navigator.platform || 'Unknown',
      status: 'Active',
    };

    this._deviceService.createDevice(this.userId(), deviceData).subscribe({
      next: (res) => {
        console.log('Dispositivo sincronizado correctamente');
        this.devicesResource.reload(); // Refrescar la lista de dispositivos
      },
      error: (error) => {
        console.error('Error al sincronizar el dispositivo:', error);
      },
    });

    // await this._deviceService.createDevice(this.userId(), deviceData);
    // this.devicesResource.reload(); // Refrescar la lista de dispositivos
  }

  constructor(){
    effect(() => {
      //this.currentUserAgent = navigator.userAgent;
      console.log(this.currentUserAgent);
      console.log(this.getBrowserInfo());
      
      
    });
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent.toLowerCase();
        // Detección del navegador
        let browser = 'Unknown';
        if (/firefox/.test(userAgent)) browser = 'Firefox';
        else if (/edg/.test(userAgent)) browser = 'Edge';
        else if (/chrome/.test(userAgent)) browser = 'Chrome';
        else if (/safari/.test(userAgent)) browser = 'Safari';
        else if (/opera/.test(userAgent)) browser = 'Opera';
    return browser;
  }
}
