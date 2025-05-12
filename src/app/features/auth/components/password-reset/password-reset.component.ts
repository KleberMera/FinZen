import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { FORGOT_PASSWORD_PAGES } from '../../forgot-password.routes';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { PasswordStrengthService, PasswordStrength } from '../../services/password-strength.service';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export default class PasswordResetComponent {
  //readonly code = input.required<string>();
  private _fb = inject(FormBuilder);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);
  private _router = inject(Router);
  private _passwordStrength = inject(PasswordStrengthService);
  
  readonly code = this._stageService.code;
  
  // Variables para mostrar/ocultar contraseñas
  showNewPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  passwordStrength = signal<PasswordStrength>({ score: 0, feedback: '', color: '#ff4444' });

  passwordForm: FormGroup = this._fb.group(
    {
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator.bind(this)
      ]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit() {
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(password => {
      if (password) {
        this.passwordStrength.set(this._passwordStrength.checkStrength(password));
      } else {
        this.passwordStrength.set({ score: 0, feedback: '', color: '#ff4444' });
      }
    });
  }

  resetPassword() {
    if (this.passwordForm.valid) {
      const resetPromise = firstValueFrom(this._forgotService.resetPassword(this.code(), this.passwordForm.value.newPassword));
      this.passwordForm.reset();
      toast.promise(resetPromise, {
        loading: 'Restableciendo contraseña...',
        success: (res) => {
          this._stageService.setStage('success');
          this._router.navigate([
            `/auth/${FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD}/${FORGOT_PASSWORD_PAGES.SUCCESS}`,
          ]);
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

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const strength = this._passwordStrength.checkStrength(control.value);
    return strength.score < 2 ? { weakPassword: true } : null;
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
