import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

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

  getDataByMonthRange(userId: number, filter: filterGrafics) {
    const url = `${environment.apiUrl}/grafic/range/data/${userId}`;
    return this._http.get(url, { params: filter });
  }
}
