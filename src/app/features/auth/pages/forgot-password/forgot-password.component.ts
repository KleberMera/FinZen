import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { AUTH_PAGES } from '../../auth.routes';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export default class ForgotPasswordComponent {
  private _forgotService = inject(ForgotPassService);
 // private readonly _router = inject(Router);
  readonly pages = signal(AUTH_PAGES.LOGIN);

  stage = this._forgotService.stage;
}
