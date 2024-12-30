import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { Transaction } from '@models/transaction';


@Injectable({
  providedIn: 'root',
})
export class TransaccionesService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getAllTransacciones(): Observable<Transaction> {
    const url = `${this.apiUrl}/transacciones`;
    return this.http.get<Transaction>(url);
  }

  getTrancaccion(id: number): Observable<Transaction> {
    const url = `${this.apiUrl}/transacciones/${id}`;
    return this.http.get<Transaction>(url);
  }

  getTranccionesbyUser(id: number): Observable<Transaction> {
    const url = `${this.apiUrl}/transacciones/usuario/${id}`;
    return this.http.get<Transaction>(url);
  }

  createTransaccion(objtrans: Transaction): Observable<Transaction> {
    const url = `${this.apiUrl}/transacciones`;
    return this.http.post<Transaction>(url, objtrans);
  }
}
