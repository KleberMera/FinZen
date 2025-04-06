import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { MonthlyDataItem } from '@models/grafic';
import { Observable } from 'rxjs';

type filterGrafics = {
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
};

@Injectable({
  providedIn: 'root',
})
export class GraficService {
  protected readonly _http = inject(HttpClient);

  getDataByMonthRange(
    userId: number,
    filter: filterGrafics
  ): Observable<apiResponse<MonthlyDataItem[]>> {
    const url = `${environment.apiUrl}/grafic/range/data/${userId}`;
    return this._http.get<apiResponse<MonthlyDataItem[]>>(url, {
      params: filter,
    });
  }
}
