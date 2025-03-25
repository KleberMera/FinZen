import { Component, ElementRef, inject, viewChildren, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPassService } from '../../services/forgot-pass.service';

@Component({
  selector: 'app-verify-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {
  //readonly email = input.required<string>();
  private _fb = inject(FormBuilder);
  private _forgotService = inject(ForgotPassService);
  private _stageService = inject(ForgotPassService);
  readonly codeInputs = viewChildren<ElementRef>('codeInput');
  readonly email = this._stageService.email;

  isLoading = false;

  codeForm: FormGroup = this._fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  verifyCode() {
    if (this.codeForm.valid) {
      this.isLoading = true;
      const code = this.codeForm.value.code;
      this._forgotService.verifyCode(code).subscribe({
        next: (response) => {
          // toast.success(response.message);
          this._stageService.setCode(code); // Almacena el code en el servicio
          this.isLoading = false;
          this._stageService.setStage('password-reset');
        },
        error: (error) => {
          // toast.error(error.error?.message || 'Error al verificar el código');
          this.isLoading = false;
          this.codeForm.reset();
          this.codeInputs().forEach((input) => (input.nativeElement.value = ''));
        },
      });
    }
  }

  resendCode() {
    this._forgotService.requestPasswordReset(this.email()).subscribe({
      next: (response) => {
        // toast.success('Código reenviado exitosamente');
      },
      error: (error) => {
        // toast.error(error.error?.message || 'Error al reenviar el código');
      },
    });
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
