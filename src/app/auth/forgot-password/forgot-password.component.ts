import { Component, inject } from '@angular/core';
import { LogoComponent } from "../../shared/icons/logo/logo.component";
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, LogoComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly _authService = inject(AuthService);
  private _router = inject(Router);
  form = this._authService.formLogin();

  onSubmit() {
    console.log(this.form().value);
  }

  stage: 'user-validation' | 'password-reset' | 'success' = 'user-validation';

  validateUser() {
    // Lógica para validar usuario
    this.stage = 'password-reset';
    this.form().value.user = 'test';
    
  }

  resetPassword() {
    // Lógica para restablecer contraseña
   this.stage = 'success';
  }

  goToLogin() {
    // Navegar a la página de login
    this._router.navigateByUrl('');
  }
}
