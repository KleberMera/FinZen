import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  private stageSignal = signal<'user-validation' | 'code-verification' | 'password-reset' | 'success'>('user-validation');
  private emailSignal = signal<string>('');
  private codeSignal = signal<string>('');

  // Señales de solo lectura para exponer los valores
  stage = this.stageSignal.asReadonly();
  email = this.emailSignal.asReadonly();
  code = this.codeSignal.asReadonly();

  // Métodos para actualizar los valores
  setStage(newStage: 'user-validation' | 'code-verification' | 'password-reset' | 'success') {
    this.stageSignal.set(newStage);
  }

  setEmail(email: string) {
    this.emailSignal.set(email);
  }

  setCode(code: string) {
    this.codeSignal.set(code);
  }
  
}
