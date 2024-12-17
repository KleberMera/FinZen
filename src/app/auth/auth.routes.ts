import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";



export const authRoutes: Routes = [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'sign-up',
      component: SignUpComponent,
    },
    {
      path: 'forgot-password',
      component: ForgotPasswordComponent,
    }

  ];