import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from '../../shared/icons/logo/logo.component';
import { UserComponent } from '../../shared/icons/user/user.component';
import { LockComponent } from '../../shared/icons/lock/lock.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    LogoComponent,
    UserComponent,
    LockComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  form = this._authService.formLogin();

  //Funcion para iniciar sesión
  onSubmit() {
    if (this.form().invalid) return;
    const user = this.form().value;
    this._authService.login(user).subscribe({
      next: (res) => {
        toast.success(res.message);
        this._router.navigate(['home']);
      },
      error: (err) => {
        console.log(err);
        toast.error(err.error.message);
      },
    });
  }
}
