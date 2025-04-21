import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '@models/user';
import { apiResponse } from '@models/apiResponse';
import { StorageService } from '@services/storage.service';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(StorageService);
  private keyUser = signal<string>('user');
  private keyAccessToken = signal<string>('access_token');

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
    const form = signal<FormGroup>(
      new FormGroup({
        rol_id: new FormControl(initialData.rol_id || 2, [Validators.required]),
        name: new FormControl(initialData.name || '', [Validators.required]),
        last_name: new FormControl(initialData.last_name || '', [
          Validators.required,
        ]),
        username: new FormControl(initialData.username || ''),
        email : new FormControl(initialData.email || '', [Validators.email, Validators.required]),
        password: new FormControl(initialData.password || '', [
          Validators.required,
          Validators.minLength(8),
        ]),

        status: new FormControl(initialData.status || true, [
          Validators.required,
        ]),
      })
    );

    return form;
  }

  signUp(user: User): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/auth/sign-up`;
    return this._http.post<apiResponse<User>>(url, user);
  }

  logout() {
    const url = `${environment.apiUrl}/auth/logout`;
    return this._http.post<apiResponse<User>>(url, {});
  }
}
