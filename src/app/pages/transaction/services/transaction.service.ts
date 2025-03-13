import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Category, CategoryName } from '@models/category';
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
    //  payment_method: new FormControl('efectivo', [Validators.required]),
      time: new FormControl(data.time || new Date().toLocaleTimeString('en-US', { hour12: false }), [Validators.required]),
      })
    );
    return form;
  }

  payment(){
   return (
      [
         { value: 'efectivo', label: 'Efectivo' },
         { value: 'tarjeta', label: 'Tarjeta' },
         { value: 'transferencia', label: 'Transferencia' },
         { value: 'otro', label: 'Otro' }
       ])
  }

  getCategoriesByUserId(userId: number): Observable<apiResponse<Category[]>> {
    const url = `${environment.apiUrl}/category/user/${userId}`;
    return this._http.get<apiResponse<Category[]>>(url);
  }

    getCategoryNamesByUserId(userId: number): Observable<apiResponse<CategoryName[]>> {
      const url = `${environment.apiUrl}/category/user/name/${userId}`;
      return this._http.get<apiResponse<CategoryName[]>>(url)
    }

  createTransaction(data: Transaction): Observable<apiResponse<Transaction>> {
    const url = `${environment.apiUrl}/transaction`;
    return this._http.post<apiResponse<Transaction>>(url, data);
  }

  getTransactionByUserId(id: number): Observable<apiResponse<Transaction[]>> {
    const url = `${environment.apiUrl}/transaction/user/${id}`;
    return this._http.get<apiResponse<Transaction[]>>(url);
  }

  getTotalType(transactions: Transaction[]) {
    const ingresos = transactions
      .filter((t) => t.category?.type === 'Ingreso')
      .reduce((sum, t) => sum + Number(t.amount) || 0, 0);

    const gastos = transactions
      .filter((t) => t.category?.type !== 'Ingreso')
      .reduce((sum, t) => sum + Number(t.amount) || 0, 0);


    return ingresos >= gastos ? 'Ingreso' : 'Gasto';
  }


  getTotal(transactions: Transaction[]) {

    const total = transactions
      .reduce((sum, t) => sum + Number(t.amount) || 0, 0);
    console.log(total);
    return total;
  }


  deleteTransaction(id: number) {
    const url = `${environment.apiUrl}/transaction/user/delete/${id}`;
    return this._http.delete<apiResponse<Transaction>>(url);
  }
    
}
