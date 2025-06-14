import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';

import { Salary } from '@models/salary';
import {  TransactionRecurring } from '@models/transaction';
import { Observable } from 'rxjs';
import { Debt } from '../../strategy/types/debt-types';
@Injectable({
  providedIn: 'root',
})
export class MethodPlanService {
  protected readonly _http = inject(HttpClient);

  getDebtByIdData(id: number): Observable<apiResponse<Debt[]>> {
    const url = `${environment.apiUrl}/method/debt/user/${id}`;
    return this._http.get<apiResponse<Debt[]>>(url);
  }

  getSalaryByMonth(
    userId: number,
    month: number,
    year: number,
  ): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary/user/${userId}/month`;
    return this._http.get<apiResponse<Salary>>(url, {
      params: { month, year },
    });
  }

  findDebtsByUserWithAmortizations(
    userId: number,
    debtIds: number[]
  ): Observable<Debt[]> {
    const url = `${environment.apiUrl}/debt/user/debtsIds/${userId}`;
    return this._http.post<Debt[]>(url, { debtIds });
  }


    getRecurringTransaction(userid: number): Observable<TransactionRecurring[]> {
      const url = `${environment.apiUrl}/recurrent-transaction/${userid}`;
      return this._http.get<TransactionRecurring[]>(url);
    }
  
}
