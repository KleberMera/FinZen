import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';
import { apiResponse } from '@models/apiResponse';
import { Category } from '@models/category';
import { Transaction } from '@models/transaction';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly _http = inject(HttpClient);

  formTransaction(data: Partial<Transaction> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        category_id: new FormControl(data.category_id, [Validators.required]),
        name: new FormControl(data.name, [Validators.required]),
        description: new FormControl(data.description || ''),
        amount: new FormControl(data.amount, [Validators.required]),
        date: new FormControl(data.date, [Validators.required]),
      })
    );
    return form;
  }

  getCategoriesByUserId(userId: number): Observable<apiResponse<Category[]>> {
    const url = `${environment.apiUrl}/category/user/${userId}`;
    return this._http.get<apiResponse<Category[]>>(url)
  }

  createTransaction(data: Transaction): Observable<apiResponse<Transaction>> {
    const url = `${environment.apiUrl}/transaction`;
    return this._http.post<apiResponse<Transaction>>(url, data);
  }

  getTransactionByUserId(userId: number): Observable<apiResponse<Transaction[]>> {
    const url = `${environment.apiUrl}/transaction/user/${userId}`;
    return this._http.get<apiResponse<Transaction[]>>(url)
  }
}
