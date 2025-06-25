import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { LockComponent } from '@icons/lock/lock.component';
import { LogoComponent } from '@icons/logo/logo.component';
import { UserComponent } from '@icons/user/user.component';
import { GoogleComponent, EyeComponent, EyeSlashComponent, SpinnerComponent, SignComponent} from '../../components';
import { AUTH_PAGES } from '../../auth.routes';
import { firstValueFrom } from 'rxjs';
import { FormValidationService } from '@services/form-validation.service';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import { BreakpointService } from '@services/breakpoint.service';
export const IconsApp = [LogoComponent, UserComponent, LockComponent, GoogleComponent, EyeComponent,
                        EyeSlashComponent, SpinnerComponent, SignComponent];

@Component({
  selector: 'app-login',
  imports: [IconsApp, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _firebaseService = inject(FirebaseService);
  private readonly _router = inject(Router);
  private readonly _validationService = inject(FormValidationService);
  public readonly _BreakpointService = inject(BreakpointService);
  protected form = this._authService.formLogin();
  readonly isSubmitting = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly isGoogleLoading = signal(false);
  readonly pages = signal(AUTH_PAGES.FORGOTPASSWORD);

  ngOnInit(): void {
    const dotLottie = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector('#dotlottie-canvas') as HTMLCanvasElement,
      src: "https://lottie.host/91579913-d01a-4de0-b0b8-6bbdbeb31cce/fjwNMJrEQQ.lottie", // Cambiado a .json válido
});
    
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
    const loginPromise = firstValueFrom(await this._firebaseService.loginWithGoogle());
    toast.promise(loginPromise, {
      loading: 'Iniciando sesión con Google...',
      success: (res) => {
        this._router.navigate(['home']);
        this.isSubmitting.set(false);
        this.isGoogleLoading.set(false);
        return res.message;
      },  
    })
  }
}
