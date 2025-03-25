import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FormValidationService } from '@services/form-validation.service';
import { toast } from 'ngx-sonner';

import { StorageService } from '@services/storage.service';
import { User } from '@models/user';


import { BreakpointService } from '@services/breakpoint.service';


import { LockComponent } from '@icons/lock/lock.component';
import { LogoComponent } from '@icons/logo/logo.component';
import { LoadingGoogleComponent } from '../../components/icons/loading-google/loading-google.component';
import { EyeSlashComponent } from '../../components/icons/eye-slash/eye-slash.component';
import { EyeComponent } from '../../components/icons/eye/eye.component';
import { GoogleComponent } from '../../components/icons/google/google.component';
import { SignComponent } from '../../components/icons/sign/sign.component';
import { SpinnerComponent } from '../../components/icons/spinner/spinner.component';
import { UserCicleIconComponent } from '../../components/icons/user-cicle-icon/user-cicle-icon.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { AUTH_PAGES } from '../../auth.routes';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    GoogleComponent,
    LoadingGoogleComponent,
    LockComponent,
    EyeSlashComponent,
    EyeComponent,
    LogoComponent,
    UserCicleIconComponent,
    SpinnerComponent,
    SignComponent
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export default class SignUpComponent {
  private readonly _authService = inject(AuthService);
  private readonly _validationService = inject(FormValidationService);
  private readonly _firebaseService = inject(FirebaseService);
  private readonly _storage = inject(StorageService);
  private readonly _router = inject(Router);
  protected form = this._authService.formUserSignUp();
  private keyGoogleToken = signal<string>('googletoken');
  protected readonly _BreakpointService = inject(BreakpointService);
  readonly isSubmitting = signal<boolean>(false);
  readonly isGoogleLoading = signal(false);
  readonly pages = signal(AUTH_PAGES.LOGIN);
  showPassword = signal<boolean>(false);
  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  saveUser() {
    console.log(this.form().value);

    if (this.form().invalid) {
      toast.info('Por favor, rellene todos los campos requeridos');
      return;
    }

    if (this.form().value.password !== this.form().value.confirm_password) {
      toast.info('Las contraseñas no coinciden');
      return;
    }

    this.form().value.username = this.randomUsername();
    //Borrar el id del formulario
    delete this.form().value.id;
    const user = this.form().value;
    console.log(user);

    this._authService.signUp(user).subscribe({
      next: (res) => {
        toast.loading('Iniciando sesión...');
        const userandpass = {
          user: user.user,
          password: user.password,
        };

        this._authService.login(userandpass as User).subscribe({
          next: (res) => {
            //toast.success(res.message);
            this._router.navigate(['home']);
          },
          error: (error) => {
            toast.error(error.error.message);
          },
        });
      },
      error: (err) => {
        console.log(err);

        toast.error(err.error.message);
      },
    });
  }

  //Username random segun su nombre y apellido
  randomUsername() {
    const name = this.form().value.name;
    const last_name = this.form().value.last_name;
    const username = name.split(' ').join('') + last_name.split(' ').join('');
    return username;
  }

  async signUpWithGoogle() {
    this.isGoogleLoading.set(true);
    (await this._firebaseService.signUpWithGoogle()).subscribe({
      next: (res) => {
        // toast.success(res.message);
        toast.loading('Iniciando sesión...');

        const google = this._storage.get(this.keyGoogleToken());
        // console.log(google);
        const login = this._firebaseService.loginPostCreate(google as string);
        login.subscribe({
          next: (res) => {
            // toast.success(res.message);
            this._router.navigate(['home']);
            this._storage.remove(this.keyGoogleToken());
            this.isGoogleLoading.set(false);
          },
          error: (error) => {
            this.isGoogleLoading.set(false);
          },
        });
      },
      error: (error) => {
        this.isGoogleLoading.set(false);
      },
    });
  }
}
