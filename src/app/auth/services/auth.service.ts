import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User, UserResponse } from '../../models/user';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  formUser(initialData: Partial<User> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        id: new FormControl(initialData.id || null),
        rol_id: new FormControl(initialData.rol_id || 2, [Validators.required]),
        name: new FormControl(initialData.name || '', [Validators.required]),
        last_name: new FormControl(initialData.last_name || '', [Validators.required]),
        username: new FormControl(initialData.username || ''),
        user: new FormControl(initialData.user || '', [Validators.required]),
        email: new FormControl(initialData.email || ''),
        password: new FormControl(initialData.password || '', [Validators.required]),
        phone: new FormControl(initialData.phone || ''),
        status: new FormControl(initialData.status || true, [Validators.required]),
      })
    );
  
    return form;
  }

  login(user: User) {
    const url = `${environment.apiUrl}/auth/login`;
    return this._http.post<UserResponse>(url, user);
  }

  signUp(user: User): Observable<UserResponse> {
    const url = `${environment.apiUrl}/auth/signup`;
    return this._http.post<UserResponse>(url, user);
  }

  logout() {
    const url = `${environment.apiUrl}/auth/logout`;
    return this._http.post<UserResponse>(url, {});
  }
}
