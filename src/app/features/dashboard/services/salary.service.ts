import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiResponse } from '@models/apiResponse';
import { Salary } from '@models/salary';
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

  getSalaryByMonth(userId: number, month: string): Observable<apiResponse<Salary[]>> {
    const url = `http://localhost:3000/api/salary/user/${userId}?month=${month}`;
    return this._http.get<apiResponse<Salary[]>>(url);
  }
}
