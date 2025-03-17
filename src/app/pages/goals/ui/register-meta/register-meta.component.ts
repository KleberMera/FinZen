import { Component, inject, signal } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '@services/form-validation.service';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register-meta',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register-meta.component.html',
  styleUrl: './register-meta.component.scss',
})
export class RegisterMetaComponent {
  protected readonly _metaService = inject(MetaService);
  private readonly _storageService = inject(StorageService);
  protected readonly _validationService = inject(FormValidationService);
  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );

  form = this._metaService.formMeta();
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
      this._metaService.createMeta(this.form().value).subscribe((res) => {
        toast.success(res.message);
        this.form().reset();
        this.isSubmitting.set(false);
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
