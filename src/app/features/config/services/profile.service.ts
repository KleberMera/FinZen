import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
}
