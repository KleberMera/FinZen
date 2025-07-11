import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { format } from '@formkit/tempo';
import { apiResponse } from '@models/apiResponse';
import { Category, CategoryName } from '@models/category';
import { Transaction } from '@models/transaction';
import { Observable, tap } from 'rxjs';
interface RecurringTransaction {
  frequency: string;
  nextExecutionDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
}
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly _http = inject(HttpClient);
  getCategoriesByUserId(userId: number): Observable<apiResponse<Category[]>> {
    const url = `${environment.apiUrl}/category/user/${userId}`;
    return this._http.get<apiResponse<Category[]>>(url);
  }
  formTransaction(data: Partial<Transaction> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        category_id: new FormControl(data.category_id, [Validators.required]),
        name: new FormControl(data.name, [Validators.required]),
        description: new FormControl(data.description || ''),
        amount: new FormControl(data.amount, [Validators.required]),
        date: new FormControl(data.date, [Validators.required]),
        //  payment_method: new FormControl('efectivo', [Validators.required]),
        time: new FormControl(data.time || format(new Date(), 'hh:mm:ss', 'es'), [
          Validators.required,
        ]),
      })
    );
    return form;
  }



  getCategoryNamesByUserId(
    userId: number
  ): Observable<apiResponse<CategoryName[]>> {
    const url = `${environment.apiUrl}/category/user/name/${userId}`;
    return this._http.get<apiResponse<CategoryName[]>>(url);
  }

  getCategoryTypeByUserId(
    userId: number,
    type: string
  ): Observable<apiResponse<CategoryName[]>> {
    const url = `${environment.apiUrl}/category/user/type/${userId}/${type}`;
    return this._http.get<apiResponse<CategoryName[]>>(url);
  }

  createTransaction(data: Transaction): Observable<apiResponse<Transaction>> {
    const url = `${environment.apiUrl}/transaction`;
    return this._http.post<apiResponse<Transaction>>(url, data);
  }

  updateTransaction(id: number, data: Transaction): Observable<apiResponse<Transaction>> {
   delete data.category;
   
    const url = `${environment.apiUrl}/transaction/${id}`;
    return this._http.put<apiResponse<Transaction>>(url, data);
  }

  createRecurringTransaction(
    data: RecurringTransaction,
    transactionId: number,
    userid: number
  ): Observable<any> {
    const url = `${environment.apiUrl}/recurrent-transaction/${transactionId}/${userid}`;
    return this._http.post<any>(url, data);
  }

  editRecurringTransaction(
    id: number,
    data: RecurringTransaction,
    userid: number
  ): Observable<any> {
    const url = `${environment.apiUrl}/recurrent-transaction/${id}/${userid}`;
    return this._http.patch<any>(url, data);
  }



  getTransactionByUserId(id: number): Observable<apiResponse<Transaction[]>> {
    const url = `${environment.apiUrl}/transaction/user/${id}`;
    return this._http.get<apiResponse<Transaction[]>>(url);
  }

  getTransactionByCategoryId( categoryId: number): Observable<apiResponse<Transaction[]>> {
    const url = `${environment.apiUrl}/transaction/category/${categoryId}`;
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
    const total = transactions.reduce(
      (sum, t) => sum + Number(t.amount) || 0,
      0
    );
    //console.log(total);
    return total;
  }

  deleteTransaction(id: number) {
    const url = `${environment.apiUrl}/transaction/user/delete/${id}`;
    return this._http.delete<apiResponse<Transaction>>(url);
  }


  deleteTransactionRecurring(id: number, userId: number): Observable<apiResponse<Transaction>> {
    const url = `${environment.apiUrl}/recurrent-transaction/${id}`;
    return this._http.delete<apiResponse<Transaction>>(url, {
      body: { userId }, // userId ahora va en el cuerpo de la solicitud
    });
  }
}
