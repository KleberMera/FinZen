import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { UserUpdate } from '../../../config/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  protected readonly http = inject(HttpClient);
  protected readonly fb = inject(FormBuilder);

  // Formulario reactivo para usuarios
  userForm(): FormGroup {
    return this.fb.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$')
      ]],
      last_name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$')
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_\.]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]+$')
      ]],
      status: [true],
      rol_id: [null],
      avatar: [null]
    });
  }

  createUser(data: User): Observable<apiResponse<User>> {
    const url = `${environment.apiUrl}/user`;
    return this.http.post<apiResponse<User>>(url, data);
  }


  // updateUser(id: number, data: User): Observable<apiResponse<User>> {
  //   const url = `${environment.apiUrl}/user/${id}`;
  //   return this.http.put<apiResponse<User>>(url, data);
  // }


  updateUser(user: UserUpdate): Observable<apiResponse<UserUpdate>> {
    const url = `${environment.apiUrl}/auth/update-user/${user.id}`;
    return this.http.put<apiResponse<UserUpdate>>(url, user);
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
