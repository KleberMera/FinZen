import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { CategoryExpenseDistribution, WeeklyDataItem } from '@models/grafic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraficsService {
  protected readonly _http = inject(HttpClient);

  getGraficWeeklYByUserId(
    userId: number
  ): Observable<apiResponse<WeeklyDataItem[]>> {
    const url = `${environment.apiUrl}/grafic/weekly-summary/${userId}`;
    return this._http.get<apiResponse<WeeklyDataItem[]>>(url);
  }

  getExpenseDistributionByMonth(
    month: number,
    year: number
  ): Observable<apiResponse<CategoryExpenseDistribution[]>> {
    const url = `${environment.apiUrl}/grafic-admin/expense-distribution/${month}/${year}`;
    return this._http.get<apiResponse<CategoryExpenseDistribution[]>>(url);
  }
}
