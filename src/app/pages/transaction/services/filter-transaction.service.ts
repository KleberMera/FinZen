import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { CategoryName } from '@models/category';
import { TransactionName } from '@models/transaction';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FilterTransactionService {
  private readonly _http = inject(HttpClient);

  getTransactionNamesByUserId(userId: number): Observable<apiResponse<TransactionName>> {
    const url = `${environment.apiUrl}/transaction/user/name/${userId}`;
    return this._http.get<apiResponse<TransactionName>>(url)
  }

  getCategoryNamesByUserId(userId: number): Observable<apiResponse<CategoryName>> {
    const url = `${environment.apiUrl}/category/user/name/${userId}`;
    return this._http.get<apiResponse<CategoryName>>(url)
  }
}
