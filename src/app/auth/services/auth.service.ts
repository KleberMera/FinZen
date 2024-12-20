import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from './storage.service';
import { User } from '@models/user';
import { apiResponse } from '@models/apiResponse';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(StorageService);
  private keyUser = signal<string>('user');
  private keyAccessToken = signal<string>('access_token');

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
        email: new FormControl(initialData.email || ''),
        password: new FormControl(initialData.password || '', [
          Validators.required,
        ]),
        phone: new FormControl(initialData.phone || ''),
        status: new FormControl(initialData.status || true, [
          Validators.required,
        ]),
      })
    );

    return form;
  }

  formLogin(initialData: Partial<User> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        user: new FormControl(initialData.user || '', [Validators.required]),
        password: new FormControl(initialData.password || '', [
          Validators.required,
        ]),
      })
    );

    return form;
  }

  login(user: User) {
    const url = `${environment.apiUrl}/auth/login`;
    return this._http.post<apiResponse<User>>(url, user).pipe(
      tap((res) => {
        // console.log(res);
        this._storage.set(this.keyUser(), res.data);
        this._storage.set(this.keyAccessToken(), res.access_token);
      })
    );
  }

  signUp(user: User): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/auth/signup`;
    return this._http.post<apiResponse<User>>(url, user);
  }

  logout() {
    const url = `${environment.apiUrl}/auth/logout`;
    return this._http.post<apiResponse<User>>(url, {});
  }
}
