import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';
import { apiResponse } from '@models/apiResponse';
import { Debt } from '@models/debt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  private readonly _http = inject(HttpClient);

  formDebt(data: Partial<Debt> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        user_id: new FormControl(data.user_id, [Validators.required]),
        name: new FormControl(data.name),
        description: new FormControl(data.description || ''),
        amount: new FormControl(data.amount, [Validators.required]),
        interest_rate: new FormControl(data.interest_rate,),
        duration_months: new FormControl(data.duration_months, [Validators.required]),
        method: new FormControl(data.method),
        start_date: new FormControl(data.start_date, [Validators.required]),
        end_date: new FormControl(data.end_date, [Validators.required]),
        status: new FormControl(data.status),
        amortizations: new FormArray(data.amortizations?.map(
          (amortizations) =>
            new FormGroup({
              number_months: new FormControl(amortizations.number_months, [Validators.required]),
              date: new FormControl(amortizations.date, [Validators.required]),
              quota: new FormControl(amortizations.quota, [Validators.required]),
              interest: new FormControl(amortizations.interest, [Validators.required]),
              amortized: new FormControl(amortizations.amortized, [Validators.required]),
              outstanding: new FormControl(amortizations.outstanding, [Validators.required]),
              status: new FormControl(amortizations.status),
            })
        ) || []

        ),
      })
    );

    return form;
  }

  getDebtsByUserId(userId: number): Observable<apiResponse<Debt[]>> {
    const url = `${environment.apiUrl}/debt/user/${userId}`;
    return this._http.get<apiResponse<Debt[]>>(url);
  }

  createDebt(data: Debt): Observable<apiResponse<Debt>> {
    const url = `${environment.apiUrl}/debt`;
    return this._http.post<apiResponse<Debt>>(url, data);
  }


}
