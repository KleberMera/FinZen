import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@models/category';
import { apiResponse } from '@models/apiResponse';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import  iconsData  from '@public/icons.json';

export interface primeIcons {
  icon: string;
}

@Injectable({
  providedIn: 'root',
})


export class CategoryService {
  private apiUrl = environment.apiUrl;
  public readonly primeIcons = signal<primeIcons[]>(iconsData);
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
