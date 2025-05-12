import { Component, ElementRef, inject, viewChildren, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';
import { Router } from '@angular/router';
import { FORGOT_PASSWORD_PAGES } from '../../forgot-password.routes';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-verify-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export default class VerifyCodeComponent {
  //readonly email = input.required<string>();
  private _fb = inject(FormBuilder);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);
  readonly codeInputs = viewChildren<ElementRef>('codeInput');
  readonly email = this._stageService.email;
  private _router = inject(Router);

  isLoading = false;

  codeForm: FormGroup = this._fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  verifyCode() {
    if (this.codeForm.valid) {
      this.isLoading = true;
      const verifyPromise = firstValueFrom(this._forgotService.verifyCode(this.codeForm.value.code));
      toast.promise(verifyPromise, {
        loading: 'Verificando código...',
        success: (res) => {
          this._stageService.setCode(this.codeForm.value.code); // Almacena el code en el servicio
          this.isLoading = false;
          this._stageService.setStage('password-reset');
          this._router.navigate([`/auth/${FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD}/${FORGOT_PASSWORD_PAGES.PASSWORD_RESET}`]);
          return res.message;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.codeForm.reset();
          this.codeInputs().forEach((input) => (input.nativeElement.value = ''));
          return error.error?.message;
        },
      });
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    input.value = value;
    if (value.length === 1 && index < 5) {
      this.focusNext(index);
    }
    this.updateCodeValue();
  }

  onKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && index > 0 && !input.value) {
      this.focusPrevious(index);
    }
    this.updateCodeValue();
  }

  onPaste(event: ClipboardEvent, index: number) {
    if (index === 0) {
      const pastedData = event.clipboardData?.getData('text').replace(/[^a-zA-Z0-9]/g, '');
      if (pastedData && pastedData.length === 6) {
        this.codeInputs().forEach((input, i) => {
          input.nativeElement.value = pastedData[i];
        });
        this.updateCodeValue();
        this.codeInputs().at(-1)!.nativeElement.focus();
      }
      event.preventDefault();
    }
  }

  private focusNext(index: number) {
    const nextInput = this.codeInputs()[index + 1];
    if (nextInput) nextInput.nativeElement.focus();
  }

  private focusPrevious(index: number) {
    const prevInput = this.codeInputs()[index - 1];
    if (prevInput) prevInput.nativeElement.focus();
  }

  private updateCodeValue() {
    const code = this.codeInputs().map((input) => input.nativeElement.value).join('');
    this.codeForm.get('code')?.setValue(code);
  }
}
