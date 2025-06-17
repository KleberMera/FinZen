import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { GoalService } from '../../services/goal.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormContributionComponent } from '../../components/form-contribution/form-contribution.component';
import { ProgressGoalComponent } from '../../components/progress-goal/progress-goal.component';
import { GoalRegisterComponent } from '../../components/goal-register/goal-register.component';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { TitleGradient } from '@models/styleClass';
import { StorageService } from '@services/storage.service';
import { BottomSheetComponent } from '../../../../shared/components/bottom-sheet';
import { SideSheetComponent } from "../../../../shared/components/side-sheet/side-sheet.component";

@Component({
  selector: 'app-goal-view',
  imports: [
    CurrencyPipe,
    FormContributionComponent,
    ProgressGoalComponent,
    GoalRegisterComponent,
    BottomSheetComponent,
    SideSheetComponent
],
  templateUrl: './goal-view.component.html',
  styleUrl: './goal-view.component.scss',
})
export class GoalViewComponent {
  protected readonly goalService = inject(GoalService);
  protected readonly storageService = inject(StorageService);
  userId = signal<number>(this.storageService.getUserId());
  goalId = signal<number | null>(null);
  titleClass = TitleGradient.GREEN_EMERALD;
  isBottomSheetOpen = signal<boolean>(false);
  isSideSheetOpen = signal<boolean>(false);



  closeSideSheet() {
    this.isSideSheetOpen.set(false);
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
    loader: ({ request }) =>
      this.goalService.getGoalTrackingByUserIdAndGoalId(
        request!.userId!,
        request!.goalId!
      ),
  });

  // Computed para obtener la meta seleccionada
  selectedGoal = computed(() => {
    if (!this.goalId() || !this.goal.value()?.data) return null;
    // Cambiamos user_id por meta_id como identificador único
    return this.goal.value()?.data!.find((g) => g.id === this.goalId());
  });

  // Método para seleccionar una meta
  selectGoal(id: number) {
    this.goalId.set(id);
    console.log('Seleccionado goal', id);
  }

  // Método para traducir el estado de la meta
  getStatusTranslation(status: string | undefined): string {
    if (!status) return 'En progreso';

    switch (status) {
      case 'Active':
        return 'Activo';
      case 'Completed':
        return 'Completado';
      case 'Cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  reloadContributions() {
    this.goalContributions.reload();
  }

  
  onCreateSuccess() {
    this.goal.reload(); // Recargar las metas después de crear una nueva
  }


 


  closeBottomSheet() {
    this.isBottomSheetOpen.set(false);
    
  }


  deleteContribution(contributionId: number) {
    // this.goalService.deleteGoalContribution(contributionId).subscribe(() => {
    //   this.reloadContributions();
    // });

    const goalPromise = firstValueFrom(
      this.goalService.deleteGoalContribution(contributionId)
    );
    toast.promise(goalPromise, {
      loading: 'Eliminando aporte...',
      success: (res) => {
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
      loading: 'Eliminando meta...',
      success: (data) => {
        // Reload goals after deletion
        this.goal.reload();
        this.goalId.set(null);
        return data.message;
      },
    });
  }
}
