import { Injectable } from '@angular/core';
import { Device } from '@models/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceUtilService {
  // Método para verificar si un dispositivo es el actual
  isCurrentDevice(device: Device): boolean {
    return (
      device.userAgent === navigator.userAgent &&
      device.os === (navigator.platform || 'Unknown') &&
      device.browser === this.getBrowserInfo() &&
      device.isMobile === this.isMobileDevice() &&
      device.brand === (navigator.vendor || 'Unknown') &&
      device.model === (navigator.platform || 'Unknown')
    );
  }

  // Método para obtener información del navegador
  getBrowserInfo(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/firefox/.test(userAgent)) return 'Firefox';
    if (/edg/.test(userAgent)) return 'Edge';
    if (/chrome/.test(userAgent)) return 'Chrome';
    if (/safari/.test(userAgent)) return 'Safari';
    if (/opera/.test(userAgent)) return 'Opera';
    return 'Unknown';
  }

  // Método para verificar si es un dispositivo móvil
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Método para obtener datos del dispositivo actual
  getCurrentDeviceData(): Device {
    return {
      userAgent: navigator.userAgent,
      os: navigator.platform || 'Unknown',
      browser: this.getBrowserInfo(),
      isMobile: this.isMobileDevice(),
      brand: navigator.vendor || 'Unknown',
      model: navigator.platform || 'Unknown',
      status: 'Active',
    };
  }
}
