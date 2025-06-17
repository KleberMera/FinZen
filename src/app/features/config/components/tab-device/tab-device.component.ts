import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DeviceService } from '../../services/device.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { Device } from '@models/device';
import { DeviceUtilService } from '../../services/device-util.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-tab-device',
  imports: [],
  templateUrl: './tab-device.component.html',
  styleUrl: './tab-device.component.scss',
})
export default class TabDeviceComponent {
  private readonly _deviceService = inject(DeviceService);
  private readonly _storage = inject(StorageService);
  private readonly _deviceUtil = inject(DeviceUtilService);

  // Signal para el ID del usuario
  userId = signal<number>(this._storage.getUserId());

  // Recurso reactivo para la lista de dispositivos
  devicesResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => this._deviceService.getDevicesByUserId(request.userId),
  });

  private isCurrentDevice(device: Device): boolean {
    return this._deviceUtil.isCurrentDevice(device);
  }

  // Computed signal para determinar si el dispositivo actual está registrado
  isCurrentDeviceRegistered = computed(() => {
    const devices = this.devicesResource.value()?.data || [];
    return devices.some(device => this.isCurrentDevice(device));
  });

  // Signal para el estado de sincronización
  isSynchronizing = signal<boolean>(false);

  // Método para sincronizar el dispositivo
  synchronizeDevice() {
    if (this.isSynchronizing()) return;
    
    this.isSynchronizing.set(true);
    const deviceData = this._deviceUtil.getCurrentDeviceData();

    this._deviceService.createDevice(this.userId(), deviceData).subscribe({
      next: () => {
        console.log('Dispositivo sincronizado correctamente');
        this.devicesResource.reload(); // Refrescar la lista de dispositivos
        toast.success('Dispositivo sincronizado correctamente');
      },
      error: (error) => {
        console.error('Error al sincronizar el dispositivo:', error);
        toast.error('Error al sincronizar el dispositivo');
      },
      complete: () => {
        this.isSynchronizing.set(false);
      }
    });
  }

  deleteDevice(deviceId: number) {
    this._deviceService.deleteDevice(this.userId(), deviceId).subscribe({
      next: () => {
        console.log('Dispositivo eliminado correctamente');
        this.devicesResource.reload(); // Refrescar la lista de dispositivos
        toast.success('Dispositivo eliminado correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar el dispositivo:', error);
        toast.error('Error al eliminar el dispositivo');
      },
    });
  }



  // Método público para usar en la plantilla
  isCurrentDeviceFn(device: Device): boolean {
    return this.isCurrentDevice(device);
  }
}
