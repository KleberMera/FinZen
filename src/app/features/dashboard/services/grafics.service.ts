import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { CategoryExpenseDistribution, TrendData, WeeklyDataItem } from '@models/grafic';
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


  getExpenseDistributionTrend(
    startMonth: number,
    startYear: number,
    endMonth: number,
    endYear: number
  ): Observable<apiResponse<{ trendData: TrendData[]; summary: CategoryExpenseDistribution[] }>> {
    const url = `${environment.apiUrl}/grafic-admin/expense-distribution-trend/${startMonth}/${startYear}/${endMonth}/${endYear}`;
    return this._http.get<apiResponse<{ trendData: TrendData[]; summary: CategoryExpenseDistribution[] }>>(url);
  }
}
