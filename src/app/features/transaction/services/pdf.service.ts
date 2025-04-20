import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Transaction } from '@models/transaction';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  protected readonly _http = inject(HttpClient);

  generatePDF(data: Transaction[]) {
    const url = `${environment.apiUrl}/report/generate-pdf`;
    return this._http.post(url, data, {
      responseType: 'blob', // Especifica que esperas un blob (archivo binario)
      observe: 'response'   // Para obtener la respuesta completa con headers
    });
  }
}
