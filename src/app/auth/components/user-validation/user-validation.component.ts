import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';

@Component({
  selector: 'app-user-validation',
  imports: [ReactiveFormsModule],
  templateUrl: './user-validation.component.html',
  styleUrl: './user-validation.component.scss'
})
export class UserValidationComponent {
  private _fb = inject(FormBuilder);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);

  isLoading = false;

public  userForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  validateUser() {
    if (this.userForm.valid) {
      this.isLoading = true;
      const email = this.userForm.value.email;
      this._forgotService.requestPasswordReset(email).subscribe({
        next: (response) => {
          // toast.success(response.message);
          this._stageService.setEmail(email); //
          this.isLoading = false;
          this._stageService.setStage('code-verification');
        },
        error: (error) => {
          // toast.error(error.error?.message || 'Error al enviar el código');
          this.isLoading = false;
          this.userForm.reset();
        },
      });
    }
  }

  goToCodeVerification() {
    this._stageService.setStage('code-verification');
  }
}
