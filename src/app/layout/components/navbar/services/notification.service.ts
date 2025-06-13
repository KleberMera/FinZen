import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Observable } from 'rxjs';
interface updateDaysBeforeNotifyAll {
  count: number;
}
export type BeforeNotifyAll = Notify[]

export interface Notify {
  daysBeforeNotify: number
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  protected readonly _http = inject(HttpClient);

  getNotificationsByUserId(userId: number): Observable<apiResponse<any>> {
    const url = `${environment.apiUrl}/notifications/user/${userId}`;
    return this._http.get<apiResponse<any>>(url);
  }

  getfilterNotificationsByUserId(userId: number, isRead?: string,debtId?: string,  includeAllDebts?: string): Observable<any> {
    const url = `${environment.apiUrl}/notifications/filter/${userId}`;
    let params = new HttpParams();
    if (debtId) params = params.set('debtId', debtId);
    if (isRead) params = params.set('isRead', isRead);
    if (includeAllDebts) params = params.set('includeAllDebts', includeAllDebts);
    return this._http.get<any>(url, { params });
  } 

  markNotificationAsRead(userId: number, notificationId: number): Observable<any> {
    const url = `${environment.apiUrl}/notifications/mark-as-read/${notificationId}/user/${userId}`;
    return this._http.put<any>(url, {});
  }



  notificationSubscribeWithDevice(
    userId: number,
    deviceId: number,
    subscription: any
  ) {
    const url = `${environment.apiUrl}/notifications/subscribe/${userId}/${deviceId}`;

    return this._http.post<apiResponse<any>>(url, { subscription });
  }

  hasSubscription(userId: number): Observable<{ hasSubscription: boolean }> {
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

  // Método para desuscribir con deviceId
  unsubscribeWithDevice(userId: number, deviceId: number) {
    const url = `${environment.apiUrl}/notifications/unsubscribe/${userId}/${deviceId}`;
    return this._http.delete(url);
  }

  updateDaysBeforeNotifyAll(userId: number, daysBeforeNotify: number): Observable<apiResponse<updateDaysBeforeNotifyAll>> {
    const url = `${environment.apiUrl}/notifications/update-days-before-notify-all/${userId}`;
    return this._http.put<apiResponse<updateDaysBeforeNotifyAll>>(url, { daysBeforeNotify });
  }

  getDaysBeforeNotifyAll(userId: number): Observable<apiResponse<BeforeNotifyAll>> {
    const url = `${environment.apiUrl}/notifications/days-before-notify-all/${userId}`;
    return this._http.get<apiResponse<BeforeNotifyAll>>(url);
  }
}
