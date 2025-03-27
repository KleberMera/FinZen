import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Transaction } from '@models/transaction';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private readonly _http = inject(HttpClient);

  imageProcess(image: File, userId: number) {
    const url = `${environment.apiUrl}/tickets/process-receipt/${userId}`;
    const formData = new FormData();
    formData.append('file', image);
    return this._http.post<apiResponse<Transaction>>(url, formData);
  }

  textProcess(text: string, userId: number) {
    const url = `${environment.apiUrl}/tickets/process-text/${userId}`;
    return this._http.post<apiResponse<Transaction>>(url, { text });
  }
}
