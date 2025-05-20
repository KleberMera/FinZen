import { Component, inject, signal, effect, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAdminService } from '../../services/user-admin.service';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { User } from '@models/user';

@Component({
  selector: 'app-sidebar-data-user',
  imports: [ReactiveFormsModule],
  templateUrl: './sidebar-data-user.component.html',
  styleUrl: './sidebar-data-user.component.scss',
})
export class SidebarDataUserComponent {
  private readonly _userAdminService = inject(UserAdminService);
   readonly isSubmitting = signal(false);

  // Datos del usuario
  readonly userData = input<User | null>(null);

  // Evento para cerrar el sidebar
  readonly closeUserData = output<void>();

  // Formulario reactivo
   readonly form = this._userAdminService.userForm();

  constructor() {
    // Cuando se actualicen los datos del usuario, actualizar el formulario
    effect(() => {
      const userData = this.userData();
      if (userData) {
        this.form.patchValue({
          ...userData
        });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
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
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const userDataValue = this.userData();
      const userData: any = {
        ...this.form.value,
        id: userDataValue?.id,
        status: true,
        firebaseUid: userDataValue?.firebaseUid,
        user: userDataValue?.user,
        password: userDataValue?.password,
        confirm_password: userDataValue?.confirm_password,
        rol_id: userDataValue?.rol_id || 2
      };

      const promise = firstValueFrom(
        this._userAdminService.updateUser( userData)
      );

      toast.promise(promise, {
        loading: 'Actualizando usuario...',
        success: (data) => {
          this.closeUserData.emit();
          return data.message;
        },
        error: (error: any) => {
          this.isSubmitting.set(false);
          return error.message;
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      toast.error('Por favor, corrige los errores del formulario');
    }
  }

  close() {
    this.closeUserData.emit();
  }
}
