import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  getErrorMessage(control: FormControl | null): string {
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      email: 'Debe ser un email válido',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'El formato no es válido',
      invalidPassword: 'La contraseña no cumple con los requisitos',
      passwordMismatch: 'Las contraseñas no coinciden',
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Campo inválido';
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}
