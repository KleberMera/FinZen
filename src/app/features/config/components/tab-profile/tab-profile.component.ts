import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../services/profile.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { ProfileImageService } from '../../../../shared/services/profile-image.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-tab-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './tab-profile.component.html',
  styleUrl: './tab-profile.component.scss'
})
export default class TabProfileComponent {
  private readonly _profileService = inject(ProfileService);
  private readonly _storageService = inject(StorageService);
  protected readonly _profileImageService = inject(ProfileImageService);
  protected readonly imageUrl = computed(() => this._profileImageService.getImageUrl());
  protected readonly selectedUserId = signal<number>(this._storageService.getUserId());
  protected readonly isSubmitting = signal(false);

  // Formulario reactivo para el perfil
  profileForm = this._profileService.profileForm();

  // Recurso para obtener los datos del usuario
  userProfile = rxResource({
    request: () => ({ userId: this.selectedUserId() }),
    loader: ({ request }) => this._profileService.getUserById(request.userId),
  });

  // Datos computados del usuario
  protected readonly user = computed(() => {
    return this.userProfile.value()?.data;
  });

  constructor() {
    // Cuando se carguen los datos del usuario, actualizar el formulario
    effect(() => {
      const response = this.userProfile.value();
      if (response?.data) {
        this.profileForm().patchValue({
        ...response.data
        });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm().get(controlName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['pattern']) {
      switch (controlName) {
        case 'name':
        case 'last_name':
          return 'Solo se permiten letras y espacios';
        case 'username':
          return 'Solo se permiten letras, números y guiones bajos';
        case 'email':
          return 'Ingresa un correo electrónico válido';
        case 'phone':
          return 'Ingresa un número de teléfono válido (10 dígitos)';
        default:
          return 'Formato inválido';
      }
    }
    if (control.errors['email']) return 'Ingresa un correo electrónico válido';
    return 'Error de validación';
  }

  onSubmit() {
    if (this.profileForm().valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const userData = {
        ...this.profileForm().value,
        id: this.selectedUserId(),
        status: true,
        firebaseUid: this.user()?.firebaseUid,
      };

      this._profileService.updateUser(userData).subscribe({
        next: (response) => {
          toast.success(response.message);
          this.userProfile.reload();
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.profileForm().controls).forEach(key => {
        const control = this.profileForm().get(key);
        control?.markAsTouched();
      });
      toast.error('Por favor, corrige los errores del formulario');
    }
  }
}
