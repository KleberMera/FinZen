import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';

import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly _http = inject(HttpClient);

  getUserProfile(userId: number): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/auth/user/${userId}`;
    return this._http.get<apiResponse<User>>(url);
  }
}
