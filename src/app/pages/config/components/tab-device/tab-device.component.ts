import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DeviceService } from '../../services/device.service';
import { StorageService } from '@services/storage.service';
import { Device } from '@models/device';

import { UAParser } from 'ua-parser-js';
import { toast } from 'ngx-sonner';
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
  currentUserAgent: string = navigator.userAgent;
  parser = new UAParser(this.currentUserAgent);
  devicesResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) =>
      this._deviceService.getDevicesByUserId(request.userId),
  });

  isCurrentDeviceRegistered(): boolean {
    const devices = this.devicesResource.value()?.data || [];
    return devices.some(
      (device) =>
        device.userAgent === this.parser.getUA() &&
        device.os === (this.parser.getOS().name || 'Unknown') &&
        device.browser === (this.parser.getBrowser().name || 'Unknown') &&
          device.isMobile === (this.parser.getDevice().type === 'mobile') &&
          device.brand === (this.parser.getDevice().vendor || navigator.vendor || 'Unknown') &&
          device.model === (this.parser.getDevice().model || navigator.platform || 'Unknown')
    );
  }



  async synchronizeDevice() {
   toast.loading('Sincronizando dispositivo...');

    const deviceData: Device = {
      userAgent: this.parser.getUA(),
      os: this.parser.getOS().name || 'Unknown',
      browser: this.parser.getBrowser().name || 'Unknown',
      isMobile: this.parser.getDevice().type === 'mobile',
      brand: this.parser.getDevice().vendor || navigator.vendor || 'Unknown',
      model: this.parser.getDevice().model || navigator.platform || 'Unknown',
      status: 'Active',
    };

    console.log(deviceData);
    

    this._deviceService.createDevice(this.userId(), deviceData).subscribe({
      next: (res) => {
        console.log('Dispositivo sincronizado correctamente');
        toast.success(`Dispositivo ${deviceData.brand} sincronizado correctamente`);
        this.devicesResource.reload(); // Refrescar la lista de dispositivos
      },
      error: (error) => {
        console.error('Error al sincronizar el dispositivo:', error);
      },
    });

   
    this.devicesResource.reload(); // Refrescar la lista de dispositivos
  }



  isCurrentDevice(device: any): boolean {
    return (
      device.userAgent === this.parser.getUA() &&
      device.os === (this.parser.getOS().name || 'Unknown') &&
      device.browser === (this.parser.getBrowser().name || 'Unknown') &&
      device.isMobile === (this.parser.getDevice().type === 'mobile') &&
      device.brand === (this.parser.getDevice().vendor || navigator.vendor || 'Unknown') &&
      device.model === (this.parser.getDevice().model || navigator.platform || 'Unknown')
    );
  }

}
