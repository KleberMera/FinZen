import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormValidationService } from '@services/form-validation.service';
import { toast } from 'ngx-sonner';
import { GoogleComponent } from "../icons/google/google.component";
import { FirebaseService } from '../services/firebase.service';
import { LoadingGoogleComponent } from "../components/loading-google/loading-google.component";

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, GoogleComponent, LoadingGoogleComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private readonly _authService = inject(AuthService);
  private readonly _validationService = inject(FormValidationService);
  private readonly _firebaseService = inject(FirebaseService);
  private readonly _router = inject(Router);  
  protected form = this._authService.formUser();
  readonly isGoogleLoading = signal(false);
  // Helper methods para la validación
  getErrorMessage(fieldName: string): string {
    return this._validationService.getErrorMessage(
      this.form().get(fieldName) as FormControl
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return this._validationService.isFieldInvalid(this.form(), fieldName);
  }

  saveUser() {
    if (this.form().invalid) {
      toast.info('Por favor, rellene todos los campos requeridos');
      return;
    }

    if (this.form().value.password !== this.form().value.confirm_password) {
      toast.info('Las contraseñas no coinciden');
      return;
    }

    this.form().value.username = this.randomUsername();
    //Borrar el id del formulario
    delete this.form().value.id;
    delete this.form().value.confirm_password;
    const user = this.form().value;
    console.log(user);

    this._authService.signUp(user).subscribe({
      next: (res) => {
        toast.success(res.message);
        this.form().reset();
      },
      error: (err) => {
        console.log(err);

        toast.error(err.error.message);
      },
    });
  }

  //Username random segun su nombre y apellido
  randomUsername() {
    const name = this.form().value.name;
    const last_name = this.form().value.last_name;
    const username = name.split(' ').join('') + last_name.split(' ').join('');
    return username;
  }


  async signUpWithGoogle() {
    this.isGoogleLoading.set(true);
    (await this._firebaseService.signUpWithGoogle()).subscribe({
      next: (res) => {
        toast.success(res.message);
        this._router.navigate(['auth']);
       
      },
      error: (error) => {
        this.isGoogleLoading.set(false);
      },
    });
  }
}
