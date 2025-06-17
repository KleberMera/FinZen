import { Component, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../services/goal.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Goal, GoalContribution } from '@models/meta';
import { FormContributionComponent } from "../../components/form-contribution/form-contribution.component";
import { ProgressGoalComponent } from "../../components/progress-goal/progress-goal.component";
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { TitleGradient } from '@models/styleClass';
import { GoalContainerComponent } from "../../components/goal-container/goal-container.component";


@Component({
  selector: 'app-goal-view',
  standalone: true,
  imports: [CommonModule, FormContributionComponent, ProgressGoalComponent, GoalContainerComponent],
  templateUrl: './goal-view.component.html',
  styleUrl: './goal-view.component.scss',
})
export class GoalViewComponent {
  protected readonly goalService = inject(GoalService);
  protected readonly storageService = inject(StorageService);
  userId = signal<number>(this.storageService.getUserId());
  goalId = signal<number | null>(null);
  showSidebar = signal<boolean>(false);
  isBottomSheetOpen = signal<boolean>(false);
  titleClass = TitleGradient.GREEN_EMERALD


onCreateSuccess(){
  this.goal.reload(); // Recargar las metas después de crear una nueva
}



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

  reloadContributions() {
    this.goalContributions.reload();
  }

  toggleSidebar() {
    this.showSidebar.set(!this.showSidebar());
  }

  closeBottomSheet() {
    this.isBottomSheetOpen.set(false);
  }
  
  // Método para manejar cuando se guarda una contribución
  handleContributionSaved() {
    this.toggleSidebar(); // Cerrar el sidebar
    this.reloadContributions(); // Recargar las contribuciones
  }

  deleteContribution(contributionId: number) {
    // this.goalService.deleteGoalContribution(contributionId).subscribe(() => {
    //   this.reloadContributions();
    // });

    const goalPromise = firstValueFrom(this.goalService.deleteGoalContribution(contributionId));
    toast.promise(goalPromise, {
      loading: 'Eliminando aporte...',
      success: (res)=> {
        this.reloadContributions();
        return res.message;
      },
     
    });
  }

    // Calculate progress percentage for the selected goal
  progressPercentage = computed(() => {
    const goal = this.selectedGoal();
    if (!goal?.target_amount || goal.target_amount <= 0) return 0;
    
    // For now, just return 0% if no contributions, 100% if has contributions
    return goal.hasContributions ? 100 : 0;
  });

  deleteGoal(goalId: number) {
    const promise = firstValueFrom(this.goalService.deleteGoal(goalId));
    toast.promise(promise, {
      loading: 'Eliminando objetivo...',
      success: (data) => {
        // Reload goals after deletion
        this.goal.reload();
        this.goalId.set(null);
        return data.message;
      },

    });
  }
}
