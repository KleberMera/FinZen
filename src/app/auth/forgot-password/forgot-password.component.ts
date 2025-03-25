import { Component, inject } from '@angular/core';
import { LogoComponent } from '../../shared/icons/logo/logo.component';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForgotPassService } from '../services/forgot-pass.service';
import { toast } from 'ngx-sonner';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _forgotService = inject(ForgotPassService);

  // Stages
  stage: 'user-validation' | 'code-verification' | 'password-reset' | 'success' = 'user-validation';
  isLoading = false;

  // Formularios
  userForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  goToCodeVerification() {
    this.stage = 'code-verification';
  }

  codeForm: FormGroup = this._fb.group({
    code: [
      '', 
      [
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(6),
      ]
    ],
  });

  passwordForm: FormGroup = this._fb.group(
    {
      newPassword: [
        '', 
        [
          Validators.required, 
          Validators.minLength(6)
        ]
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  // Método para validar usuario
  validateUser() {
    if (this.userForm.valid) {
      this.isLoading = true;
      this._forgotService
        .requestPasswordReset(this.userForm.value.email)
        .subscribe({
          next: (response) => {
            toast.success(response.message);
            this.isLoading = false;
            this.stage = 'code-verification';
          },
          error: (error) => {
          //  toast.error(error.error?.message || 'Error al enviar el código');
            this.userForm.reset();
            this.isLoading = false;
          }
        });
    }
  }

  // Método para verificar código
  verifyCode() {
    if (this.codeForm.valid) {
      this._forgotService.verifyCode(this.codeForm.value.code).subscribe({
        next: (response) => {
          toast.success(response.message);
          this.stage = 'password-reset';
        },
        error: (error) => {
          toast.error(error.error?.message || 'Error al verificar el código');
          this.codeForm.reset();
        }
      });
    }
  }

  // Método para restablecer contraseña
  resetPassword() {
    if (this.passwordForm.valid) {
      this._forgotService
        .resetPassword(
          this.codeForm.value.code,
          this.passwordForm.value.newPassword
        )
        .subscribe({
          next: (response) => {
            toast.success(response.message);
            this.stage = 'success';
          },
          error: (error) => {
            toast.error(error.error?.message || 'Error al restablecer la contraseña');
            this.passwordForm.reset();
          }
        });
    }
  }

  // Método para reenviar código
  resendCode() {
    if (this.userForm.get('email')?.valid) {
      this._forgotService
        .requestPasswordReset(this.userForm.value.email)
        .subscribe({
          next: (response) => {
            toast.success('Código reenviado exitosamente');
          },
          error: (error) => {
            toast.error(error.error?.message || 'Error al reenviar el código');
          }
        });
    }
  }

  // Método para navegar al login
  goToLogin() {
    this._router.navigateByUrl('/login');
  }

  // Validador personalizado para coincidir contraseñas
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
}
