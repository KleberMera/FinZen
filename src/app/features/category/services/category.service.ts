
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@models/category';
import { apiResponse } from '@models/apiResponse';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import  iconsData  from '@public/icons.json';
import { environment } from '@environments/environment';

type IconsData = Record<string, { icon: string }[]>;


@Injectable({
  providedIn: 'root',
})


export class CategoryService {
  private apiUrl = environment.apiUrl;
 // public readonly primeIcons = iconsData;
  private readonly htpp = inject(HttpClient);

  //public readonly primeIcons: iconsData
 public readonly primeIcons = iconsData;
 // private readonly htpp = inject(HttpClient);

  public getPrimeIcons() {
    // Convertir el objeto de categorías en un array plano
    const flatIcons: { icon: string }[] = [];
    
    Object.values(this.primeIcons).forEach(categoryIcons => {
      flatIcons.push(...categoryIcons);
    });
    
    return flatIcons;
  }

  public getPrimeIconsByCategory() {
    return this.primeIcons;
  }


// O usando Object.prototype.hasOwnProperty para mayor seguridad
public getIconsByCategory(category: string) {
  return this.primeIcons.hasOwnProperty(category) 
    ? (this.primeIcons as any)[category] 
    : [];
}



  // Método adicional para obtener las categorías disponibles
  public getAvailableCategories(): string[] {
    return Object.keys(this.primeIcons);
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
        user_id: new FormControl(initialData.user_id || null),
        name: new FormControl(initialData.name || '', [Validators.required]),
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

  updateCategory(id: number, categoria: Category): Observable<apiResponse<Category>> {
    const url = `${this.apiUrl}/category/${id}`;
    return this.htpp.put<apiResponse<Category>>(url, categoria);
  }
}
