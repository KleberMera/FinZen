import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';
import { format } from '@formkit/tempo';
import { apiResponse } from '@models/apiResponse';
import { DataProgress, Goal, GoalContribution } from '@models/meta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private readonly _htpp = inject(HttpClient);

  createGoal(goal: Goal): Observable<apiResponse<Goal>> {
    const url = `${environment.apiUrl}/goal`;
    return this._htpp.post<apiResponse<Goal>>(url, goal);
  }

  createGoalContribution(
    goalContribution: GoalContribution,
    userId: number
  ): Observable<apiResponse<GoalContribution>> {
    const url = `${environment.apiUrl}/goal/contribution/${goalContribution.goal_id}/${userId}`;
    return this._htpp.post<apiResponse<GoalContribution>>(url, goalContribution);
  }

  getGoalByUserId(userId: number): Observable<apiResponse<Goal[]>> {
    const url = `${environment.apiUrl}/goal/user/${userId}`;
    return this._htpp.get<apiResponse<Goal[]>>(url);
  }

  getGoalTrackingByUserIdAndGoalId(userId: number, goalId: number): Observable<apiResponse<GoalContribution[]>> {
    const url = `${environment.apiUrl}/goal/contribution/user/${userId}/${goalId}`;
    return this._htpp.get<apiResponse<GoalContribution[]>>(url);
  }

  formGoal(goal: Partial<Goal> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        user_id: new FormControl(goal.user_id, [Validators.required]),
        name: new FormControl(goal.name, [Validators.required]),
        description: new FormControl(goal.description || ''),
        target_amount: new FormControl(goal.target_amount, [Validators.required]),
        deadline: new FormControl(format(goal.deadline!, 'YYYY-MM-DD', 'es'), [Validators.required]),
        start_date: new FormControl(format(new Date(), 'YYYY-MM-DD', 'es')),
        status: new FormControl(goal.status || 'Active'),
      })
    );
    return form;

  }

  formGoalContribution(goalContribution: Partial<GoalContribution> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        goal_id : new FormControl(goalContribution.goal_id, [Validators.required]),
        amount: new FormControl(goalContribution.amount, [Validators.required]),
        date: new FormControl(format(goalContribution.date!, 'YYYY-MM-DD', 'es'), [Validators.required]),
        note: new FormControl(goalContribution.note || ''),
      })
    );
    return form;
  }

  getGoalProgress(userId: number,goalId: number): Observable<apiResponse<DataProgress>> {
    const url = `${environment.apiUrl}/goal/progress/${userId}/${goalId}`;
    return this._htpp.get<apiResponse<DataProgress>>(url);
  }
}
