import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { FinanceSummary } from '@models/finance';
import { MonthlyExpenseRequest, Salary } from '@models/salary';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  protected readonly _http = inject(HttpClient);

  constructor() {}

  // getSalary(id: number): Observable<any> {
  //   return this._http.get<any>(`http://localhost:3000/api/salary/${id}`);
  // }

  getSalaryByMonth(
    userId: number,
    month: string
  ): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary/user/${userId}/month?month=${month}`;
    return this._http.get<apiResponse<Salary>>(url);
  }

  createSalary(salary: Salary): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary`;
    return this._http.post<apiResponse<Salary>>(url, salary);
  }

  getTotalExpenseByUserAndMonth(
    data: MonthlyExpenseRequest
  ): Observable<apiResponse<{ total: number }>> {
    const url = `${environment.apiUrl}/transaction/user/total/month`;
    return this._http.post<apiResponse<{ total: number }>>(url, data);
  }

  getTotalIncomeByUserAndMonth(
    data: MonthlyExpenseRequest
  ): Observable<apiResponse<{ total: number }>> {
    const url = `${environment.apiUrl}/transaction/user/total/income/month`;
    return this._http.post<apiResponse<{ total: number }>>(url, data);
  }

  getFinancialSummaryAI(
    userId: number,
    month: number,
    year: number
  ): Observable<apiResponse<FinanceSummary>> {
    const url = `${environment.apiUrl}/finance/summary/ai/${userId}`;
    const data = { month, year };
    return this._http.post<apiResponse<FinanceSummary>>(url, data);
  }



  getFinancialSummary(
    userId: number,
    month: number,
    year: number
  ): Observable<apiResponse<FinanceSummary>> {
    const url = `${environment.apiUrl}/finance/summary/${userId}`;
    const data = { month, year };
    return this._http.post<apiResponse<FinanceSummary>>(url, data);
  }
}
