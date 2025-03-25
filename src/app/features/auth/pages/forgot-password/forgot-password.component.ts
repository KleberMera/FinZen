import { Component, inject, signal } from '@angular/core';

import {
  UserValidationComponent,
  VerifyCodeComponent,
  PasswordResetComponent,
  SuccessComponent,
} from '../../components';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { Router, RouterLink } from '@angular/router';
import { AUTH_PAGES } from '../../auth.routes';

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
}
