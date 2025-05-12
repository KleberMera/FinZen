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
import { EyeSlashComponent } from '../../components/icons/eye-slash/eye-slash.component';
import { EyeComponent } from '../../components/icons/eye/eye.component';
import { GoogleComponent } from '../../components/icons/google/google.component';
import { SignComponent } from '../../components/icons/sign/sign.component';
import { SpinnerComponent } from '../../components/icons/spinner/spinner.component';
import { UserCicleIconComponent } from '../../components/icons/user-cicle-icon/user-cicle-icon.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { AUTH_PAGES } from '../../auth.routes';
import { PasswordStrengthService, PasswordStrength } from '../../services/password-strength.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    GoogleComponent,
    LockComponent,
    EyeSlashComponent,
    EyeComponent,
    LogoComponent,
    UserCicleIconComponent,
    SpinnerComponent,
    SignComponent,
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
  private readonly _passwordStrength = inject(PasswordStrengthService);
  protected form = this._authService.formUserSignUp();
  private keyGoogleToken = signal<string>('googletoken');
  protected readonly _BreakpointService = inject(BreakpointService);
  readonly isSubmitting = signal<boolean>(false);
  readonly isGoogleLoading = signal(false);
  readonly pages = signal(AUTH_PAGES.LOGIN);
  protected showPassword = signal<boolean>(false);
  protected showConfirmPassword = signal<boolean>(false);
  passwordStrength = signal<PasswordStrength>({ score: 0, feedback: '', color: '#ff4444' });

  constructor() {
    this.form().addValidators(this._authService.passwordMatchValidator);
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

  ngOnInit() {
    this.form().get('password')?.valueChanges.subscribe((password) => {
        if (password) {
          this.passwordStrength.set(this._passwordStrength.checkStrength(password));
        } else {
          this.passwordStrength.set({ score: 0, feedback: '', color: '#ff4444' });
        }
      });
  }


  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword.set(!this.showPassword());
    } else if (field === 'confirm') {
      this.showConfirmPassword.set(!this.showConfirmPassword());
    }
  }

  saveUser() {
    this.isSubmitting.set(true);
    //toast.info('Registrando...');
    //Borrar el id del formulario
    delete this.form().value.confirmPassword;
    const user = this.form().value;
    this._authService.signUp(user).subscribe({
      next: (res) => {
        toast.info(res.message);
        const userandpass = { email: user.email, password: user.password };
        const login = firstValueFrom( this._authService.login(userandpass as User));
        toast.promise(login, {
          loading: 'Iniciando sesión...',
          success: (res) => {
            this._router.navigate(['home']);
            this.isSubmitting.set(false);
            return res.message;
          },
        })
      },
      error: (err) => {
        console.log(err);
        this.isSubmitting.set(false);
        this.isGoogleLoading.set(false);
        toast.error(err.error.message);
      },
    });
  }

  async signUpWithGoogle() {
    this.isGoogleLoading.set(true);
    toast.info('Registrando con Google...');
    (await this._firebaseService.signUpWithGoogle()).subscribe({
      next: (res) => {
        const google = this._storage.get(this.keyGoogleToken());
        const login = firstValueFrom(this._firebaseService.loginPostCreate(google as string));
        toast.promise(login, {
          loading: 'Iniciando sesión...',
          success: (res) => {
            this._router.navigate(['home']);
            this._storage.remove(this.keyGoogleToken());
            this.isGoogleLoading.set(false);
            return res.message;
          },
          error: (error: any) => {
            this.isGoogleLoading.set(false);
            return error.error.message;
          },
        })
      },
      error: (error) => {
        this.isGoogleLoading.set(false);
      },
    });
  }
}
