import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { FORGOT_PASSWORD_PAGES } from '../../forgot-password.routes';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

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
  
    // Variables para mostrar/ocultar contraseñas
    showNewPassword = signal<boolean>(false);
    showConfirmPassword = signal<boolean>(false);
    

  passwordForm: FormGroup = this._fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  resetPassword() {
    if (this.passwordForm.valid){
      const resetPromise = firstValueFrom(
        this._forgotService.resetPassword(this.code(), this.passwordForm.value.newPassword)
      );
      this.passwordForm.reset();
      toast.promise(resetPromise, {
        loading: 'Restableciendo contraseña...',
        success: (res) => {
          this._stageService.setStage('success');
          this._router.navigate([`/auth/${FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD}/${FORGOT_PASSWORD_PAGES.SUCCESS}`]);
          return res.message;
        },
      });

    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  // Función para alternar visibilidad de contraseña
  togglePasswordVisibility(field: 'new' | 'confirm'): void {
    if (field === 'new') {
      this.showNewPassword.set(!this.showNewPassword());
    } else {
      this.showConfirmPassword.set(!this.showConfirmPassword());
    }
  }
}
