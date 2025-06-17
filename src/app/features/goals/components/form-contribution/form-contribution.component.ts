import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  output,
  Output,
  signal,
} from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { GoalContribution } from '@models/meta';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { SideSheetContentComponent } from '../../../../shared/components/side-sheet/side-sheet-content.component';
import { SolidColor } from '@models/styleClass';

@Component({
  selector: 'app-form-contribution',
  imports: [ReactiveFormsModule, CommonModule, SideSheetContentComponent],
  templateUrl: './form-contribution.component.html',
  styleUrl: './form-contribution.component.scss',
})
export class FormContributionComponent {
  protected readonly _goalService = inject(GoalService);
  goalId = input.required<number>();
  userId = input.required<number>();
  title = SolidColor;
  protected readonly form = this._goalService.formGoalContribution();
  protected isSaving = signal<boolean>(false);

  protected onSave = output<void>();
  protected onCancel = output<void>();

  // Inicializar el formulario con el ID de la meta
  constructor() {
    effect(() => {
      if (this.goalId()) {
        this.form().patchValue({
          goal_id: this.goalId(),
        });

        console.log('Form initialized with goal_id:', this.goalId());
      }
    });
  }

  saveContribution() {
    if (this.form().invalid) return;

    this.isSaving.set(true);
    const contribution: GoalContribution = this.form()
      .value as GoalContribution;

    this._goalService
      .createGoalContribution(contribution, this.userId())
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          toast.success(res.message);
          this.form().controls['amount'].reset();
          this.form().controls['date'].reset();
          this.form().controls['note'].reset();
          this.onSave.emit();
          this.cancel();
        },
      });
  }

  cancel() {
    this.form().controls['amount'].reset();
    this.form().controls['date'].reset();
    this.form().controls['note'].reset();
    this.onCancel.emit();
  }
}
