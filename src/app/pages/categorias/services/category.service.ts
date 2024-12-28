import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@models/category';
import { apiResponse } from '@models/apiResponse';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';

export interface primeIcons {
  icon: string;
}

@Injectable({
  providedIn: 'root',
})

//Servicio de categorias
export class CategoryService {
  private apiUrl = environment.apiUrl;
  public readonly primeIcons = signal<primeIcons[]>([
    { icon: 'pi pi-users' },
    { icon: 'pi pi-shopping-cart' },
    { icon: 'pi pi-shop' },
    { icon: 'pi pi-credit-card' },
    { icon: 'pi pi-calendar' },
    { icon: 'pi pi-check' },
    { icon: 'pi pi-cloud' },
    { icon: 'pi pi-exclamation-triangle' },
    { icon: 'pi pi-external-link' },
    { icon: 'pi pi-file' },
    { icon: 'pi pi-flag' },
    { icon: 'pi pi-heart' },
    { icon: 'pi pi-info-circle' },
    { icon: 'pi pi-lock' },
    { icon: 'pi pi-map-marker' },
    { icon: 'pi pi-minus' },
    { icon: 'pi pi-paperclip' },
    { icon: 'pi pi-pencil' },
    { icon: 'pi pi-plus' },
    { icon: 'pi pi-search' },
    { icon: 'pi pi-star' },
    { icon: 'pi pi-tag' },
    { icon: 'pi pi-tags' },
    { icon: 'pi pi-trash' },
    { icon: 'pi pi-user' },
    { icon: 'pi pi-user-edit' },
    { icon: 'pi pi-user-minus' },
    { icon: 'pi pi-user-plus' },
    { icon: 'pi pi-volume-down' },
    { icon: 'pi pi-volume-off' },
    { icon: 'pi pi-volume-up' },
    { icon: 'pi pi-wifi' },
    { icon: 'pi pi-wrench' },
  ]);
  private readonly htpp = inject(HttpClient);

  public getPrimeIcons() {
    return this.primeIcons;
  }

  createCategoria(categoria: Category): Observable<apiResponse<Category>> {
    const url = `${this.apiUrl}/category`;
    return this.htpp.post<apiResponse<Category>>(url, categoria);
  }

  getCategoriesByUserId(userId: number): Observable<apiResponse<Category[]>> {
    const url = `${this.apiUrl}/category/user/${userId}`;
    return this.htpp.get<apiResponse<Category[]>>(url);
  }

  formCategory(initialData: Partial<Category> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        //id: new FormControl(initialData.id || null),
        user_id: new FormControl(initialData.user_id || null),
        name: new FormControl(initialData.name || '', [Validators.required]),
        //description: new FormControl(initialData.description || ''),
        type: new FormControl(initialData.type || '', [Validators.required]),
        icon: new FormControl(initialData.icon || ''),
      })
    );
    return form;
  }

  deleteCategory(id: number): Observable<apiResponse<Category>> {
    const url = `${this.apiUrl}/category/${id}`;
    return this.htpp.delete<apiResponse<Category>>(url);
  }
}
