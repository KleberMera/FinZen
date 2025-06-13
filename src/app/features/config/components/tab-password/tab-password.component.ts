import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStateService } from '@services/auth-state.service';

@Component({
  selector: 'app-tab-password',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './tab-password.component.html',
  styleUrl: './tab-password.component.scss'
})
export default class TabPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly storageService = inject(StorageService);
  private readonly _authService = inject(AuthStateService);
  protected readonly userId = this.storageService.getUserId();

  // Estados
  showPassword = signal(false);
  isLoading = signal(false);
  showNewPasswordFields = signal(false);
  currentPasswordVerified = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Formulario para la contraseña actual
  currentPasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Formulario para la nueva contraseña
  newPasswordForm = this.fb.group({
    newPassword: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    ]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  // Validador personalizado para verificar que las contraseñas coincidan
  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Verificar contraseña actual
  verifyCurrentPassword(): void {
    if (this.currentPasswordForm.invalid) return;
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    
    if (!this.userId) {
      this.errorMessage.set('No se pudo obtener la información del usuario');
      this.isLoading.set(false);
      return;
    }

    this.profileService.verifyCurrentPassword(this.userId, this.currentPasswordForm.value.currentPassword!)
      .subscribe({
        next: (data) => {
          if(data.success){
            this.currentPasswordVerified.set(true);
            this.showNewPasswordFields.set(true);
            this.successMessage.set('Contraseña verificada correctamente');
            this.isLoading.set(false);
          }else{
            this.errorMessage.set(data.message);
            this.isLoading.set(false);
          }
        },

      });
  }

  // Cambiar contraseña
  changePassword(): void {
    if (this.newPasswordForm.invalid) return;
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    
    if (!this.userId) {
      this.errorMessage.set('No se pudo obtener la información del usuario');
      this.isLoading.set(false);
      return;
    }

    const newPassword = this.newPasswordForm.get('newPassword')?.value;
    if (!newPassword) return;

    this.profileService.resetPasswordId(this.userId, newPassword)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage.set(response.message);
            this.resetForms();
            this.isLoading.set(false);
            toast.success(response.message);
            this._authService.logout();
          } else {
            this.errorMessage.set(response.message || 'Error al actualizar la contraseña');
            this.isLoading.set(false);
          }
        },
      });
  }

  // Reiniciar formularios
  private resetForms(): void {
    this.currentPasswordForm.reset();
    this.newPasswordForm.reset();
    this.showNewPasswordFields.set(false);
    this.currentPasswordVerified.set(false);
  }

  // Método para mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  // Método para volver al paso de verificación
  backToVerification(): void {
    this.showNewPasswordFields.set(false);
    this.currentPasswordVerified.set(false);
    this.newPasswordForm.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
