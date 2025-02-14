import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';
import { Amortization, UpdateStatusDto } from '@models/amortization';
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
        name: new FormControl(data.name, [Validators.required]),
        description: new FormControl(data.description || ''),
        amount: new FormControl(data.amount, [Validators.required]),
        interest_rate: new FormControl(data.interest_rate,),
        duration_months: new FormControl(data.duration_months, [Validators.required]),
        method: new FormControl(data.method),
        start_date: new FormControl(data.start_date, [Validators.required]),
        end_date: new FormControl(data.end_date, [Validators.required]),
        status: new FormControl(data.status || 'Pendiente'),
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

  getDebtsByUserIdDebt(userId: number): Observable<apiResponse<Debt[]>> {
    const url = `${environment.apiUrl}/debt/user/${userId}/debt`;
    return this._http.get<apiResponse<Debt[]>>(url);
  }

  getAmortizationsByDebtId(debtId: number): Observable<apiResponse<Amortization[]>> {
    const url = `${environment.apiUrl}/debt/amortizations/${debtId}`;
    return this._http.get<apiResponse<Amortization[]>>(url);
  }

  createDebt(data: Debt): Observable<apiResponse<Debt>> {
    const url = `${environment.apiUrl}/debt`;
    return this._http.post<apiResponse<Debt>>(url, data);
  }

  updateDebtStatus(debtId: number, updateData: UpdateStatusDto): Observable<apiResponse<Debt>> {
    console.log('updateData', updateData);
    console.log('debtId', debtId);
    
    
    const url = `${environment.apiUrl}/debt/update-status/${debtId}`;
    return this._http.put<apiResponse<Debt>>(url, updateData);
  }


}
