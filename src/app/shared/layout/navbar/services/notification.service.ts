import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  protected readonly _http = inject(HttpClient);

  getNotificationsByUserId(userId: number): Observable<apiResponse<any>> {
    const url = `${environment.apiUrl}/notifications/user/${userId}`;
    return this._http.get<apiResponse<any>>(url);
  }

  notificationSuscribe(userId: number, subscription: any): Observable<any> {
    const url = `${environment.apiUrl}/notifications/subscribe`;
    return this._http.post<any>(url, { userId, subscription });
  }

  hasSubscription(userId: number,): Observable<{ hasSubscription: boolean }> {
    const url = `${environment.apiUrl}/notifications/has-subscription/${userId}`;
    return this._http.get<{ hasSubscription: boolean }>(url);
  }

  unsubscribe(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/notifications/unsubscribe/${userId}`;
    return this._http.delete(url);
  }

  countSubscriptions(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/notifications/count-subscriptions/${userId}`;
    return this._http.get<any>(url);
  }


  notificationSubscribeWithDevice(userId: number, deviceId: number, subscription: PushSubscription) {
    const url = `${environment.apiUrl}/notification/subscribe`;
    const payload = {
      userId,
      deviceId,
      subscription: JSON.stringify(subscription)
    };
    return this._http.post<apiResponse<any>>(url, payload);
  }
  
  // Método para desuscribir con deviceId
  unsubscribeWithDevice(userId: number, deviceId: number) {
    const url = `${environment.apiUrl}/notification/unsubscribe`;
    const payload = { userId, deviceId };
    return this._http.post<apiResponse<any>>(url, payload);
  }


}
