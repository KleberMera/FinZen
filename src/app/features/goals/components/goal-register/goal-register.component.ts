import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { toast } from 'ngx-sonner';
import { GoalService } from '../../services/goal.service';
import { BottomSheetContentComponent } from '../../../../shared/components/bottom-sheet-content/bottom-sheet-content.component';
import { SimpleGradient, SolidColor } from '@models/styleClass';

@Component({
  selector: 'app-goal-register',
  standalone: true,
  imports: [BottomSheetContentComponent, ReactiveFormsModule],
  templateUrl: './goal-register.component.html',
  styleUrl: './goal-register.component.scss',
})
export class GoalRegisterComponent {
  // Título y estilos
  title = signal<string>('Registrar Meta');
  titleClass = SolidColor;
  // Inyecciones de servicios
  protected readonly _goalService = inject(GoalService);
  private readonly _storageService = inject(StorageService);
  protected readonly _validationService = inject(FormValidationService);
  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );

  // Eventos
  closeUserSidebar = output<void>();
  createSuccess = output<void>();

  form = this._goalService.formGoal();
  protected readonly isSubmitting = signal(false);

  constructor() {
    this.form().patchValue({
      user_id: this.seletedUser(),
    });
  }

  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  async saveMeta(event: SubmitEvent) {
    if (this.form().invalid || this.isSubmitting()) return;
    console.log(this.form().value);

    try {
      this.isSubmitting.set(true);
      this._goalService.createGoal(this.form().value).subscribe((res) => {
        toast.success(res.message);
        this.formReset();
        this.isSubmitting.set(false);
        this.createSuccess.emit();
        this.closeUserSidebar.emit();
      });
    } catch (error) {
      console.log(error);
      this.isSubmitting.set(false);
    }
  }

  formReset() {
    this.form().reset();
    this.form().patchValue({
      user_id: this.seletedUser(),
    });
  }

  close() {
    this.closeUserSidebar.emit();
  }

  // Agregar trackBy para mejorar rendimiento de listas si las hay
  protected trackById(index: number, item: any): number {
    return item.id;
  }
}
