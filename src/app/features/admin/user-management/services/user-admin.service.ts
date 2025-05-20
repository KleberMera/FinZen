import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  protected readonly http = inject(HttpClient);

  createUser(data: User): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/user`;
    return this.http.post<apiResponse<User>>(url, data);
  }


  updateUser(id: number, data: User): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/user/${id}`;
    return this.http.put<apiResponse<User>>(url, data);
  }


  deleteUser(id: number): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/user/${id}`;
    return this.http.delete<apiResponse<User>>(url);
  }


  getAllUsers(): Observable<apiResponse<User[]>> {
    const url = `${environment.apiUrl}/user`;
    return this.http.get<apiResponse<User[]>>(url);
  }
}
