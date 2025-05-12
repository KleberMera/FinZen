import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { Router } from '@angular/router';
import { FORGOT_PASSWORD_PAGES } from '../../forgot-password.routes';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-validation',
  imports: [ReactiveFormsModule],
  templateUrl: './user-validation.component.html',
  styleUrl: './user-validation.component.scss',
})
export default class UserValidationComponent {
  private _fb = inject(FormBuilder);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);
  private _router = inject(Router);

  isLoading = false;

  public userForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  validateUser() {
    if (this.userForm.invalid) return;
    if (this.userForm.valid) {
      this.isLoading = true;
      const forgotPromise = firstValueFrom(
        this._forgotService.requestPasswordReset(this.userForm.value.email)
      );
      toast.promise(forgotPromise, {
        loading: 'Validando usuario...',
        success: (res) => {
          this._stageService.setEmail(this.userForm.value.email); //
          this.isLoading = false;
          this._stageService.setStage('code-verification');
          this._router.navigate([
            `/auth/${FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD}/${FORGOT_PASSWORD_PAGES.CODE_VERIFICATION}`,
          ]);
          return res.message;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.userForm.reset();
          return error.error?.message;
        },
      });
    }
  }

  goToCodeVerification() {
    this._router.navigate([
      `/auth/${FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD}/${FORGOT_PASSWORD_PAGES.CODE_VERIFICATION}`,
    ]);
  }
}
