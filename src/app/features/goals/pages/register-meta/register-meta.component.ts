import { Component, inject, input, output, signal } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '@services/form-validation.service';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { BottomSheetContentComponent } from "../../../../shared/components/bottom-sheet-content/bottom-sheet-content.component";

@Component({
  selector: 'app-register-meta',
  imports: [ReactiveFormsModule, FormsModule, BottomSheetContentComponent],
  templateUrl: './register-meta.component.html',
  styleUrl: './register-meta.component.scss',
})
export class RegisterMetaComponent {
   
  protected readonly _goalService = inject(GoalService);
  private readonly _storageService = inject(StorageService);
  protected readonly _validationService = inject(FormValidationService);
  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );
    closeUserSidebar = output<void>();

    createSuccess = output<void>();
    close() {
    this.closeUserSidebar.emit();
  }
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
}
