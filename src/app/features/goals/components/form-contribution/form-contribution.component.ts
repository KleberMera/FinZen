import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { GoalContribution } from '@models/meta';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-form-contribution',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-contribution.component.html',
  styleUrl: './form-contribution.component.scss',
})
export class FormContributionComponent {
  protected readonly _goalService = inject(GoalService);
  goalId = input.required<number>();
  userId = input.required<number>();
  protected readonly form = this._goalService.formGoalContribution();
  protected isSaving = signal<boolean>(false);
  
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  
  ngOnInit() {
    // Inicializar el formulario con el ID de la meta
    this.form().patchValue({
      goal_id: this.goalId()
    });
  }
  
  saveContribution() {
    if (this.form().invalid) return;
    
    this.isSaving.set(true);
    const contribution: GoalContribution = this.form().value as GoalContribution;
    
    this._goalService.createGoalContribution(contribution, this.userId()).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        toast.success(res.message);
        this.form().controls['amount'].reset();
        this.form().controls['date'].reset();
        this.form().controls['note'].reset();
        this.onSave.emit();
      },
      // error: (error) => {
      //   console.error('Error al guardar la contribución:', error);
      //   this.isSaving.set(false);
      // }
    });
  }
  
  cancel() {
    this.form().controls['amount'].reset();
        this.form().controls['date'].reset();
        this.form().controls['note'].reset();
    this.onCancel.emit();
  }
}
