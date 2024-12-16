import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LogoComponent } from "../../shared/icons/logo/logo.component";

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, LogoComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private readonly _authService = inject(AuthService);
  form = this._authService.formUser();

  saveUser() {
    console.log(this.form().value);
  }
}
