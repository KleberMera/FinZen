import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Balance } from '@models/balance';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private readonly _http = inject(HttpClient);

  getBalanceByUserId(userId: number, currentMonth: number, currentYear: number,  previousMonth: number, previousYear: number): Observable<apiResponse<Balance>> {
    //const url = `http://localhost:3000/balance/user/${id}`;
    const url = `${environment.apiUrl}/balance/${userId}/${currentMonth}/${currentYear}/${previousMonth}/${previousYear}`;
    return this._http.get<apiResponse<Balance>>(url);
  }
}
