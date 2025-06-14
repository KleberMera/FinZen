import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { Transaction } from '@models/transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private readonly _http = inject(HttpClient);

  imageProcess(image: File, userId: number, additionalText?: string, multipleMode: boolean = false) {
    const url = `${environment.apiUrl}/tickets/process-receipt/${userId}`;
    const formData = new FormData();
    formData.append('file', image);
    
    if (additionalText) {
      formData.append('additionalText', additionalText);
    }
    
    formData.append('multipleMode', multipleMode.toString());
    
    return this._http.post<apiResponse<Transaction | Transaction[]>>(url, formData);
  }

  textProcess(text: string, userId: number, multipleMode: boolean = false): Observable<apiResponse<Transaction | Transaction[] | null>> {
    const url = `${environment.apiUrl}/tickets/process-text/${userId}`;
    return this._http.post<apiResponse<Transaction | Transaction[] | null>>(url, { text, multipleMode });
  }
  
  confirmTransactions(transactions: Transaction[], userId: number, receiptImageS3Key?: string): Observable<apiResponse<Transaction[]>> {
    const url = `${environment.apiUrl}/tickets/confirm-transactions/${userId}`;
    return this._http.post<apiResponse<Transaction[]>>(url, { transactions, receiptImageS3Key });
  }
  
  resetConversation(userId: number): Observable<apiResponse<null>> {
    const url = `${environment.apiUrl}/tickets/reset-conversation/${userId}`;
    return this._http.post<apiResponse<null>>(url, {});
  }
}
