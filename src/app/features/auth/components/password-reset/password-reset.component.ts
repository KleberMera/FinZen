import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { FORGOT_PASSWORD_PAGES } from '../../forgot-password.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export default class PasswordResetComponent {
  //readonly code = input.required<string>();
  private _fb = inject(FormBuilder);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);
  private _router = inject(Router);
  readonly code = this._stageService.code; // Accede al code desde el servicio

  passwordForm: FormGroup = this._fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  resetPassword() {
    if (this.passwordForm.valid) {
      this._forgotService.resetPassword(this.code(), this.passwordForm.value.newPassword).subscribe({
        next: (response) => {
          // toast.success(response.message);
          this._stageService.setStage('success');
          this._router.navigate([`/auth/${FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD}/${FORGOT_PASSWORD_PAGES.SUCCESS}`]);
        },
        error: (error) => {
          // toast.error(error.error?.message || 'Error al restablecer la contraseña');
          this.passwordForm.reset();
        },
      });
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
