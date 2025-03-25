import { Component, inject } from '@angular/core';

import {
  UserValidationComponent,
  VerifyCodeComponent,
  PasswordResetComponent,
  SuccessComponent,
} from '../../components';
import { ForgotPassService } from '../../services/forgot-pass.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
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

  stage = this._forgotService.stage;
}
