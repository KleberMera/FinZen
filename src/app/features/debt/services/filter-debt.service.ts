import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Debt } from '@models/debt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterDebtService {
  constructor() {}

  protected readonly _http = inject(HttpClient);

  getDebtByUserIdName(userId: number): Observable<apiResponse<Debt[]>> {
    const url = `${environment.apiUrl}/debt/user/${userId}/name`;
    return this._http.get<apiResponse<Debt[]>>(url);
  }

  getDebtByIdData(id: number): Observable<apiResponse<Debt[]>> {
    const url = `${environment.apiUrl}/debt/user/amortizations/${id}`;
    return this._http.get<apiResponse<Debt[]>>(url);
  }
}
