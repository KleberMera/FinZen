import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPassService } from '../services/forgot-pass.service';
import { toast } from 'ngx-sonner';
import { UserValidationComponent } from "../components/user-validation/user-validation.component";
import { VerifyCodeComponent } from "../components/verify-code/verify-code.component";
import { PasswordResetComponent } from "../components/password-reset/password-reset.component";
import { SuccessComponent } from "../components/success/success.component";


@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, ReactiveFormsModule, UserValidationComponent, VerifyCodeComponent, PasswordResetComponent, SuccessComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);

  stage = this._stageService.stage;

  userForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  codeForm: FormGroup = this._fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  passwordForm: FormGroup = this._fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  goToLogin() {
    this._router.navigateByUrl('/login');
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
}
