import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Debt } from '@models/debt';
import { Salary } from '@models/salary';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SnowballService {
  protected readonly _http = inject(HttpClient);

  getDebtByIdData(id: number): Observable<apiResponse<Debt[]>> {
    const url = `${environment.apiUrl}/snowball/debt/user/${id}`;
    return this._http.get<apiResponse<Debt[]>>(url);
  }

  getSalaryByMonth(
    userId: number,
    month: string
  ): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary/user/${userId}/month?month=${month}`;
    return this._http.get<apiResponse<Salary>>(url);
  }
}
