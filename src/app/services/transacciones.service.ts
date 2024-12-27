import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transacciones } from '../core/models/transacciones';

@Injectable({
  providedIn: 'root',
})
export class TransaccionesService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAllTransacciones(): Observable<Transacciones> {
    const url = `${this.apiUrl}/transacciones`;
    return this.http.get<Transacciones>(url);
  }

  getTrancaccion(id: number): Observable<Transacciones> {
    const url = `${this.apiUrl}/transacciones/${id}`;
    return this.http.get<Transacciones>(url);
  }

  getTranccionesbyUser(id: number): Observable<Transacciones> {
    const url = `${this.apiUrl}/transacciones/usuario/${id}`;
    return this.http.get<Transacciones>(url);
  }

  createTransaccion(objtrans: Transacciones): Observable<Transacciones> {
    const url = `${this.apiUrl}/transacciones`;
    return this.http.post<Transacciones>(url, objtrans);
  }
}
