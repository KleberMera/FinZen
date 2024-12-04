import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorias } from '../pages/categorias/core/models/categorias.models';
import { Usuarios } from '../pages/categorias/core/models/usuarios.modles';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

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

  createCategoria(categoria: Categorias): Observable<Categorias> {
    const url = `${this.apiUrl}/categorias`;
    return this.htpp.post<Categorias>(url, categoria);
  }
}
