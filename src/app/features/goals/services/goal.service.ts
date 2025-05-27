import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';
import { format } from '@formkit/tempo';
import { apiResponse } from '@models/apiResponse';
import { Goal, GoalContribution } from '@models/meta';
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
    goalContribution: GoalContribution
  ): Observable<apiResponse<GoalContribution>> {
    const url = `${environment.apiUrl}/goal/contribution`;
    return this._htpp.post<apiResponse<GoalContribution>>(url, goalContribution);
  }


  formGoal(goal: Partial<Goal> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        user_id: new FormControl(goal.user_id, [Validators.required]),
        name: new FormControl(goal.name, [Validators.required]),
        description: new FormControl(goal.description || ''),
        target_amount: new FormControl(goal.target_amount, [Validators.required]),
        deadline: new FormControl(format(goal.deadline!, 'YYYY-MM-DD', 'es'), [Validators.required]),
        initial_amount: new FormControl(goal.initial_amount || 0),
        start_date: new FormControl(format(new Date(), 'YYYY-MM-DD', 'es')),
        status: new FormControl(goal.status || 'Active'),
      })
    );
    return form;

  }
}
