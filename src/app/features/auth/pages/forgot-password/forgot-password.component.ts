import { Component, computed, effect, inject, signal } from '@angular/core';

import { ForgotPassService } from '../../services/forgot-pass.service';
import { Router, RouterLink } from '@angular/router';
import { AUTH_PAGES } from '../../auth.routes';
import { PasswordResetComponent } from '../../components/password-reset/password-reset.component';
import { SuccessComponent } from '../../components/success/success.component';
import { UserValidationComponent } from '../../components/user-validation/user-validation.component';
import { VerifyCodeComponent } from '../../components/verify-code/verify-code.component';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    UserValidationComponent,
    VerifyCodeComponent,
    PasswordResetComponent,
    SuccessComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export default class ForgotPasswordComponent {
  private _forgotService = inject(ForgotPassService);
  private readonly _router = inject(Router);
  readonly pages = signal(AUTH_PAGES.LOGIN);

  stage = this._forgotService.stage;
  
  stageC = effect(() => {
    if (this.pages() === AUTH_PAGES.LOGIN) {
      this._forgotService.setStage('user-validation');
    }
  });
}
