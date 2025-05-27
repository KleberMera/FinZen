import { Component, inject, input } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe, CommonModule, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-progress-goal',
  imports: [PercentPipe, CurrencyPipe],
  templateUrl: './progress-goal.component.html',
  styleUrl: './progress-goal.component.scss'
})
export class ProgressGoalComponent {
  protected readonly _goalService = inject(GoalService);
  goalId = input.required<number>();
  userId = input.required<number>();

  goalProgress = rxResource(
    {
      request: () => {
        const request = {
          userId: this.userId(),
          goalId: this.goalId(),
        };
        if (!request.goalId) return;
        return request;
      },
      loader: ({ request }) => this._goalService.getGoalProgress(request!.userId!, request!.goalId!),
    }
  );

  // Convertir porcentajes de formato decimal (ej: 38.2) a formato fracción (ej: 0.382)
  getPercentValue(value: number | undefined): number {
    if (value === undefined) return 0;
    return value / 100;
  }

  // Ya no necesitamos traducir porque viene en español del backend
  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    const statusClasses: {[key: string]: string} = {
      'En progreso': 'bg-green-100/80 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200/50 dark:border-green-700/50',
      'En riesgo': 'bg-yellow-100/80 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-200/50 dark:border-yellow-700/50',
      'Fuera de curso': 'bg-red-100/80 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200/50 dark:border-red-700/50',
      'Completado': 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200/50 dark:border-blue-700/50',
      'Vencido': 'bg-red-100/80 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200/50 dark:border-red-700/50',
      'Cancelado': 'bg-gray-100/80 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200 border-gray-200/50 dark:border-gray-700/50'
    };
    
    return statusClasses[status] || 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200/50 dark:border-blue-700/50';
  }
}
