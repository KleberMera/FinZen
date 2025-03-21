import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Device } from '@models/device';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  protected readonly _http = inject(HttpClient);

  getDevicesByUserId(userId: number) {
    const url = `${environment.apiUrl}/device/user/${userId}`;
    return this._http.get<apiResponse<Device[]>>(url);
  }

  createDevice(userId: number, device: Device) {
    const url = `${environment.apiUrl}/device/create/${userId}`;
    return this._http.post<apiResponse<Device>>(url, device)
  }

  hasNotifications(userId: number, deviceId: number) {
    const url = `${environment.apiUrl}/device/has-notifications/${deviceId}/${userId}`;
    return this._http.get<apiResponse<boolean>>(url);
  }
}
