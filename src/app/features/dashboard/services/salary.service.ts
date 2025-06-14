import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    month: number,
    year: number,
  ): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary/user/${userId}/month`;
    return this._http.get<apiResponse<Salary>>(url, {
      params: { month, year },
    });
  }

  createSalary(salary: Salary): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary`;
    return this._http.post<apiResponse<Salary>>(url, salary);
  }

  updateSalary(id: number, salary: Salary): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary/${id}`;
    return this._http.put<apiResponse<Salary>>(url, salary);
  }

  deleteSalary(id: number): Observable<apiResponse<Salary>> {
    const url = `${environment.apiUrl}/salary/${id}`;
    return this._http.delete<apiResponse<Salary>>(url);
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

  getFinancialSummaryRange(
    userId: number,
    startMonth: number,
    startYear: number,
    endMonth?: number | null,
    endYear?: number | null
  ): Observable<apiResponse<FinanceSummary[]>> {
    const url = `${environment.apiUrl}/finance/summary/range/${userId}`;
    const data = { startMonth, startYear, endMonth, endYear };
    return this._http.post<apiResponse<FinanceSummary[]>>(url, data);
  }


  salaryForm(){
   const salaryForm = signal<FormGroup>(
      new FormGroup({
        salary_amount: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
        effective_date: new FormControl(new Date(), Validators.required),
        description: new FormControl(''),
        month_name: new FormControl('', Validators.required),
      })
    );
    return salaryForm;
  }
}
