import { Component, computed, effect, inject, signal } from '@angular/core';
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
  private readonly _deviceService = inject(DeviceService);
  private readonly _storage = inject(StorageService);

  // Signal para el ID del usuario
  userId = signal<number>(this._storage.getUserId());

  // Recurso reactivo para la lista de dispositivos
  devicesResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => this._deviceService.getDevicesByUserId(request.userId),
  });

  // Función privada para verificar si un dispositivo es el actual
  private isCurrentDevice(device: Device): boolean {
    return (
      device.userAgent === navigator.userAgent &&
      device.os === (navigator.platform || 'Unknown') &&
      device.browser === this.getBrowserInfo() &&
      device.isMobile === /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
      device.brand === (navigator.vendor || 'Unknown') &&
      device.model === (navigator.platform || 'Unknown')
    );
  }

  // Computed signal para determinar si el dispositivo actual está registrado
  isCurrentDeviceRegistered = computed(() => {
    const devices = this.devicesResource.value()?.data || [];
    return devices.some(device => this.isCurrentDevice(device));
  });

  // Método para sincronizar el dispositivo
  synchronizeDevice() {
    const deviceData: Device = {
      userAgent: navigator.userAgent,
      os: navigator.platform || 'Unknown',
      browser: this.getBrowserInfo(),
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      brand: navigator.vendor || 'Unknown',
      model: navigator.platform || 'Unknown',
      status: 'Active',
    };

    this._deviceService.createDevice(this.userId(), deviceData).subscribe({
      next: () => {
        console.log('Dispositivo sincronizado correctamente');
        this.devicesResource.reload(); // Refrescar la lista de dispositivos
      },
      error: (error) => {
        console.error('Error al sincronizar el dispositivo:', error);
      },
    });
  }

  // Método privado para detectar el navegador
  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/firefox/.test(userAgent)) return 'Firefox';
    if (/edg/.test(userAgent)) return 'Edge';
    if (/chrome/.test(userAgent)) return 'Chrome';
    if (/safari/.test(userAgent)) return 'Safari';
    if (/opera/.test(userAgent)) return 'Opera';
    return 'Unknown';
  }

  // Método público para usar en la plantilla
  isCurrentDeviceFn(device: Device): boolean {
    return this.isCurrentDevice(device);
  }
}
