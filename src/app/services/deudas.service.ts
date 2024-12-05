import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deudas } from '../core/models/deudas.models';

@Injectable({
  providedIn: 'root',
})

//Servicio de Deudas
export class DeudasService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAllDeudas(): Observable<Deudas> {
    const url = `${this.apiUrl}/deudas`;
    return this.http.get<Deudas>(url);
  }

  getDeudaByUser(id: number): Observable<Deudas> {
    const url = `${this.apiUrl}/deudas/usuario/${id}`;
    return this.http.get<Deudas>(url);
  }

  getDeudaById(id: number): Observable<Deudas> {
    const url = `${this.apiUrl}/deudas/${id}`;
    return this.http.get<Deudas>(url);
  }

  createDeuda(objdeuda: Deudas): Observable<Deudas> {
    const url = `${this.apiUrl}/deudas`;
    return this.http.post<Deudas>(url, objdeuda);
  }
}
