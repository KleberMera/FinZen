import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '@models/user';
import { apiResponse } from '@models/apiResponse';
import { StorageService } from '@services/storage.service';
import { environment } from '@environments/environment';
import { VerifyEmail } from '@models/email';
import { PasswordStrengthService } from './password-strength.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(StorageService);
  private keyUser = signal<string>('user');
  private keyAccessToken = signal<string>('access_token');
    private readonly _passwordStrength = inject(PasswordStrengthService);

  formLogin(initialData: Partial<User> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        email: new FormControl(initialData.email || '', [Validators.required, Validators.email]),
        password: new FormControl(initialData.password || '', [
          Validators.required,
          Validators.minLength(8),
        ]),
      })
    );
    return form;
  }

  login(user: User): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/auth/login`;
    return this._http.post<apiResponse<User>>(url, user).pipe(
      tap((res) => {
        // console.log(res);
        this._storage.set(this.keyUser(), res.data);
        this._storage.set(this.keyAccessToken(), res.access_token);
      })
    );
  }

  formUser(initialData: Partial<User> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        id: new FormControl(initialData.id || null),
        rol_id: new FormControl(initialData.rol_id || 2, [Validators.required]),
        name: new FormControl(initialData.name || '', [Validators.required]),
        last_name: new FormControl(initialData.last_name || '', [
          Validators.required,
        ]),
        username: new FormControl(initialData.username || ''),
        user: new FormControl(initialData.user || '', [Validators.required]),
        email: new FormControl(initialData.email || '', [Validators.email]),
        password: new FormControl(initialData.password || '', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirm_password: new FormControl(initialData.confirm_password || '', [
          Validators.required,
          Validators.minLength(8),
        ]),
        phone: new FormControl(initialData.phone || '', [
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ]),
        avatar: new FormControl(initialData.avatar || ''),
        status: new FormControl(initialData.status || true, [
          Validators.required,
        ]),
      })
    );

    return form;
  }

  formUserSignUp(initialData: Partial<User> = {}) {
    const form = signal<FormGroup>(new FormGroup({
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator.bind(this)
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    rol_id: new FormControl(2, [Validators.required])
  }));

    return form;
  }


  
   passwordMatchValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control || !(control instanceof FormGroup)) return null;
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

    private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const strength = this._passwordStrength.checkStrength(control.value);
    return strength.score < 2 ? { weakPassword: true } : null;
  }

  signUp(user: User): Observable<apiResponse<Partial<User>>> {
    const username = `${user.name.toLowerCase()}_${user.last_name.toLowerCase()}`.replace(/\s+/g, '_');
    user.username = username;
    const url = `${environment.apiUrl}/auth/sign-up`;
    return this._http.post<apiResponse<Partial<User>>>(url, user);
  }

  logout() {
    const url = `${environment.apiUrl}/auth/logout`;
    return this._http.post<apiResponse<User>>(url, {});
  }


  verifyEmail(email: string): Observable<VerifyEmail> {
    const url = `${environment.apiUrlEmail}/?api_key=${environment.apiKeyEmail}&email=${email}`;
    return this._http.get<VerifyEmail>(url);
  }
} 
