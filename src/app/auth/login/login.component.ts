import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from '../../shared/icons/logo/logo.component';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  form = this._authService.formLogin();

  //Funcion para iniciar sesión
  onSubmit() {
    console.log(this.form().value);

    this._router.navigateByUrl('home');
  }
}
