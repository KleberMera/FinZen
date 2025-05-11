import { inject, Injectable, signal } from '@angular/core';
import { DebtData } from '../types/debt-types';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { apiResponse } from '@models/apiResponse';

export interface StrategyPlan {
  id: number;
  userId: number;
  datajson: string;
  dateCreated: string;
  timeCreated: string;
}

@Injectable({
  providedIn: 'root',
})
export default class StrategyStateService {
  selectedData = signal<DebtData | null>(null);
  protected readonly _http = inject(HttpClient);

  setSelectedData(data: DebtData) {
    console.log(data);

    this.selectedData.set(data);
  }

  clearSelectedData() {
    this.selectedData.set(null);
  }

  createStrategy(
    userId: number,
    data: any
  ): Observable<apiResponse<StrategyPlan>> {
    const url = `${environment.apiUrl}/snowball/strategy-plan/user/${userId}`;

    return this._http.post<apiResponse<StrategyPlan>>(url, data);
  }

  getPlan(userId: number): Observable<apiResponse<StrategyPlan>> {
    const url = `${environment.apiUrl}/snowball/strategy-plan/user/${userId}`;

    return this._http.get<apiResponse<StrategyPlan>>(url);
  }

  deletePlan(userId: number, id: number): Observable<apiResponse<StrategyPlan>> {
    const url = `${environment.apiUrl}/snowball/strategy-plan/user/${userId}/${id}`;
    return this._http.delete<apiResponse<StrategyPlan>>(url);
  }

  deleteStrategy(userId: number): Observable<apiResponse<StrategyPlan>> {
    return new Observable((observer) => {
      this.getPlan(userId).subscribe({
        next: (response) => {
          if (response.data) {
            this.deletePlan(userId, response.data.id).subscribe({
              next: (deleteResponse) => {
                this.clearSelectedData();
                observer.next(deleteResponse);
                observer.complete();
              },
              error: (error) => observer.error(error)
            });
          } else {
            observer.next({ message: 'No hay plan para eliminar', error: false, data: undefined });
            observer.complete();
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
