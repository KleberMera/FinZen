import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../services/goal.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Goal, GoalContribution } from '@models/meta';

@Component({
  selector: 'app-goal-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-view.component.html',
  styleUrl: './goal-view.component.scss',
})
export class GoalViewComponent {
  protected readonly goalService = inject(GoalService);
  protected readonly storageService = inject(StorageService);
  userId = signal<number>(this.storageService.getUserId());
  goalId = signal<number | null>(null);

  goal = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => this.goalService.getGoalByUserId(request.userId),
  });

  goalContributions = rxResource({
    request: () => {
      const request = {
        userId: this.userId(),
        goalId: this.goalId()!,
      };
      if (!request.goalId) return;
      return request;
    },
    loader: ({ request }) => this.goalService.getGoalTrackingByUserIdAndGoalId(request!.userId!, request!.goalId!),
  });

  // Computed para obtener la meta seleccionada
  selectedGoal = computed(() => {
    if (!this.goalId() || !this.goal.value()?.data) return null;
    // Cambiamos user_id por meta_id como identificador único
    return this.goal.value()?.data!.find(g => g.id === this.goalId());
  });

  // Método para seleccionar una meta
  selectGoal(id: number) {
    this.goalId.set(id);
    // Recargar las contribuciones cuando se selecciona una meta
    this.goalContributions.reload();
  }
  
  // Método para traducir el estado de la meta
  getStatusTranslation(status: string | undefined): string {
    if (!status) return 'En progreso';
    
    switch (status) {
      case 'Active': return 'Activo';
      case 'Completed': return 'Completado';
      case 'Cancelled': return 'Cancelado';
      default: return status;
    }
  }
}
