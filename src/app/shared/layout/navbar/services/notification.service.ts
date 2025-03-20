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

  hasSubscription(userId: number): Observable<{ hasSubscription: boolean }> {
    const url = `${environment.apiUrl}/notifications/has-subscription/${userId}`;
    return this._http.get<{ hasSubscription: boolean }>(url);
  }

  unsubscribe(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/notifications/unsubscribe/${userId}`;
    return this._http.delete(url);
  }


}
