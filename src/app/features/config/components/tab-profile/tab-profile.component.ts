import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../services/profile.service';
import { StorageService } from '@services/storage.service';
import { ProfileImageService } from '@services/profile-image.service';
import { User } from '@models/user';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { apiResponse } from '@models/apiResponse';

@Component({
  selector: 'app-tab-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tab-profile.component.html',
  styleUrl: './tab-profile.component.scss'
})
export default class TabProfileComponent {
  private readonly _profileService = inject(ProfileService);
  private readonly _storageService = inject(StorageService);
  protected readonly _profileImageService = inject(ProfileImageService);
  private readonly _fb = inject(FormBuilder);

  protected readonly imageUrl = computed(() => this._profileImageService.getImageUrl());

  protected readonly selectedUserId = signal<number>(this._storageService.getUserId());
  protected readonly isSubmitting = signal(false);

  // Formulario reactivo para el perfil
  profileForm: FormGroup;

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
    this.profileForm = this._fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      last_name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [
        Validators.pattern(/^[0-9]{10}$/)
      ]],
    });

    // Cuando se carguen los datos del usuario, actualizar el formulario
    effect(() => {
      const response = this.userProfile.value();
      if (response?.data) {
        this.profileForm.patchValue({
          name: response.data.name,
          last_name: response.data.last_name,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone || '',
        });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
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
    if (this.profileForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const userData = {
        ...this.profileForm.value,
        id: this.selectedUserId(),
        status: true,
        firebaseUid: this.user()?.firebaseUid,
      };

      this._profileService.updateUser(userData).subscribe({
        next: (response) => {
          toast.success('Perfil actualizado correctamente');
          this.userProfile.reload();
        },
        error: (error) => {
          toast.error('Error al actualizar el perfil');
          console.error('Error updating profile:', error);
        },
        complete: () => {
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      toast.error('Por favor, corrige los errores del formulario');
    }
  }
}
