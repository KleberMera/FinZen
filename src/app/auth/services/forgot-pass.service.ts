import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgotPassService {
  protected readonly _http = inject(HttpClient);

  requestPasswordReset(email: string): Observable<{ message: string }> {
    const url = `${environment.apiUrl}/firebase/verify-email`;
    return this._http.post<{ message: string }>(url, { email });
  }

  verifyCode(code: string): Observable<{ message: string, error : string, isvalid: boolean }> {
    const url = `${environment.apiUrl}/firebase/verify-code`;
    return this._http.post<{ message: string, error : string, isvalid: boolean }>(url, { code });
  }

  resetPassword(code: string, newPassword: string): Observable<{ message: string }> {
    const url = `${environment.apiUrl}/firebase/reset-password`;
    return this._http.post<{ message: string }>(url, { code, newPassword });
  }
}
