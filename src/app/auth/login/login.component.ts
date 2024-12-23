import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { toast } from 'ngx-sonner';
import { FormValidationService } from '@services/form-validation.service';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '@icons/logo/logo.component';
import { UserComponent } from '@icons/user/user.component';
import { LockComponent } from '@icons/lock/lock.component';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    LogoComponent,
    UserComponent,
    LockComponent,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _validationService = inject(FormValidationService);
  form = this._authService.formLogin();

   // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(this.form().get(fieldName) as FormControl);
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  //Funcion para iniciar sesión
  onSubmit() {
    if (this.form().invalid) {
      // console.log(this.form().invalid);
      // console.log(this.form().controls);
      
      // Object.keys(this.form().controls).forEach(key => {
      //   const control = this.form().get(key);
      //   if (control) {
      //     control.markAsTouched();
      //   }
      // });
      return;
    }
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
