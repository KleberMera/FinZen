import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { toast } from 'ngx-sonner';
import { StorageService } from '../../../../shared/services/storage.service';
import { User } from '@models/user';
import { BreakpointService } from '../../../../shared/services/breakpoint.service';
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
  protected isVerifyingEmail = signal<boolean>(false);
  protected emailVerified = signal<boolean>(false);
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
    // Watch password changes for strength
    this.form().get('password')?.valueChanges.subscribe((password) => {
      if (password) {
        this.passwordStrength.set(this._passwordStrength.checkStrength(password));
      } else {
        this.passwordStrength.set({ score: 0, feedback: '', color: '#ff4444' });
      }
    });

    // Watch email changes to reset verification
    this.form().get('email')?.valueChanges.subscribe(() => {
      if (this.emailVerified()) {
        this.emailVerified.update((value) => false);
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

  async verifyEmail() {
    const email = this.form().get('email')?.value;
    if (!email) {
      toast.error('Por favor, ingresa un email');
      return;
    }

    this.isVerifyingEmail.set(true);
    this.emailVerified.set(false);
    try {
      const response = await firstValueFrom(this._authService.verifyEmail(email));
      const emailData = response;
      const isSmtpValid = emailData?.is_smtp_valid?.value === true;
      const isNotDisposable = emailData?.is_disposable_email?.value === false;
      const hasMxRecords = emailData?.is_mx_found?.value === true;

      if (!isSmtpValid || !isNotDisposable || !hasMxRecords) {
        toast.error('El email no es válido o no puede recibir correos');
        this.emailVerified.set(false);
        return;
      }

      this.emailVerified.set(true);
      toast.success('Email verificado correctamente');
    } catch (error: any) {
      toast.error(error.error?.message || 'Error al verificar el email');
      this.emailVerified.set(false);
    } finally {
      this.isVerifyingEmail.set(false);
    }
  }




  saveUser() {
    if (!this.emailVerified()) {
      toast.error('Por favor, verifica el email antes de continuar');
      return;
    }
    this.isSubmitting.set(true);
    toast.info('Registrando...');
    //Borrar el id del formulario
    delete this.form().value.confirmPassword;
    const user = this.form().value;
    this._authService.signUp(user).subscribe({
      next: (res) => {
       // toast.info(res.message);
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
}
 
