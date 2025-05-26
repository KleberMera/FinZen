import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { CategoryExpenseDistribution, TrendData, TransactionStatistics, WeeklyDataItem, FilterTransactionStatistics } from '@models/grafic';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GraficsService {
  protected readonly _http = inject(HttpClient);

  getMonth(){
    return [
      { value: '01', name: 'Enero' },
      { value: '02', name: 'Febrero' },
      { value: '03', name: 'Marzo' },
      { value: '04', name: 'Abril' },
      { value: '05', name: 'Mayo' },
      { value: '06', name: 'Junio' },
      { value: '07', name: 'Julio' },
      { value: '08', name: 'Agosto' },
      { value: '09', name: 'Septiembre' },
      { value: '10', name: 'Octubre' },
      { value: '11', name: 'Noviembre' },
      { value: '12', name: 'Diciembre' }
    ];
  
  }

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


  getTransactionStatistics(filter: { month: number, year: number ,  endMont? : number, endYear? : number }): Observable<apiResponse<TransactionStatistics>> {
    const url = `${environment.apiUrl}/transaction/statistics`;
    return this._http.get<apiResponse<TransactionStatistics>>(url, { params: filter });
  }
  

}
