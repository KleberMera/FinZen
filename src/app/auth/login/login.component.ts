import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { FormValidationService } from '@services/form-validation.service';
import { LogoComponent } from '@icons/logo/logo.component';
import { UserComponent } from '@icons/user/user.component';
import { LockComponent } from '@icons/lock/lock.component';
import { FirebaseService } from '../services/firebase.service';
import { UserCicleIconComponent } from "../icons/user-cicle-icon/user-cicle-icon.component";
import { GoogleComponent } from "../icons/google/google.component";
import { EyeComponent } from "../icons/eye/eye.component";
import { EyeSlashComponent } from "../icons/eye-slash/eye-slash.component";
import { SpinnerComponent } from "../icons/spinner/spinner.component";
import { SignComponent } from "../icons/sign/sign.component";
import { LoadingGoogleComponent } from "../components/loading-google/loading-google.component";
import { BreakpointService } from '@services/breakpoint.service';

export const IconsApp = [LogoComponent, UserComponent, LockComponent];

@Component({
  selector: 'app-login',
  imports: [IconsApp, RouterLink, ReactiveFormsModule, LockComponent, UserCicleIconComponent, GoogleComponent, EyeComponent, EyeSlashComponent, SpinnerComponent, SignComponent, LoadingGoogleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _firebaseService = inject(FirebaseService);
  private readonly _router = inject(Router);
  private readonly _validationService = inject(FormValidationService);
  public readonly _BreakpointService = inject(BreakpointService);
  protected form = this._authService.formLogin();
  readonly isSubmitting = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly isGoogleLoading = signal(false);

  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  //Funcion para iniciar sesión
  onSubmit() {
    if (this.form().invalid) return;
    this.isSubmitting.set(true);
    const user = this.form().value;
    this._authService.login(user).subscribe({
      next: (res) => {
        toast.success(res.message);
        this._router.navigate(['home']);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        this.isSubmitting.set(false);
      },
    });
  }

  async loginWithGoogle() {
    this.isGoogleLoading.set(true);
    (await this._firebaseService.loginWithGoogle()).subscribe({
      next: (res) => {
        toast.success(res.message);
        this._router.navigate(['home']);
        this.isSubmitting.set(false);
        this.isGoogleLoading.set(false);
      },
      error: (error) => {
        this.isGoogleLoading.set(false);
      },
    });
  }
}
