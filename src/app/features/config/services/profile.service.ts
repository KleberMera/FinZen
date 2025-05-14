import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { Observable } from 'rxjs';
export interface UserUpdate{
  id: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  status: boolean;
  phone?: string;
  firebaseUid?: string;
}
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  protected readonly _http = inject(HttpClient);

  getUserById(id: number): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/auth/user/${id}`;
    return this._http.get<apiResponse<User>>(url);
  }


  updateUser(user: UserUpdate): Observable<apiResponse<UserUpdate>> {
    const url = `${environment.apiUrl}/auth/update-user/${user.id}`;
    return this._http.put<apiResponse<UserUpdate>>(url, user);
  }

  verifyEmail(email: string): Observable<{exists: boolean}> {
    const url = `${environment.apiUrl}/auth/verify-email`;
    return this._http.post<{exists: boolean}>(url, { email });
  }


  profileForm(data: Partial<UserUpdate> = {}){
    const form = signal<FormGroup>(
      new FormGroup({
        name: new FormControl(data.name, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
        last_name: new FormControl(data.last_name, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
        username: new FormControl(data.username, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_\.]+$/)]),
        email: new FormControl(data.email, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
        phone: new FormControl(data.phone, [Validators.pattern(/^[0-9]{10}$/)]),
      })
    );
    return form;
  
  }
}
