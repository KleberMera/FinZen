import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Categorias } from '../models/categorias.models';
import { Observable } from 'rxjs';
import { Usuarios } from '../models/usuarios.modles';

@Injectable({
  providedIn: 'root',
})
export class TransaccionesService {
  private apiUrl = environment.apiUrl;
  private readonly htpp = inject(HttpClient);

  getCategorias(id: number): Observable<Categorias[]> {
    const url = `${this.apiUrl}/categorias/${id}`;
    return this.htpp.get<Categorias[]>(url);
  }

  getUsuarios(id: number): Observable<Usuarios[]> {
    const url = `${this.apiUrl}/usuarios/${id}`;
    return this.htpp.get<Usuarios[]>(url);
  }
}
