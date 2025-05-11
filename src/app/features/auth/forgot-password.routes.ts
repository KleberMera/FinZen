import { Routes } from '@angular/router';

export enum FORGOT_PASSWORD_PAGES {
  USER_VALIDATION = 'user-validation',
  CODE_VERIFICATION = 'code-verification',
  PASSWORD_RESET = 'password-reset',
  FORGOT_PASSWORD = 'forgot-password',
  SUCCESS = 'success'
}

export const forgotPasswordRoutes: Routes = [
  {
    path: FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD,
    loadComponent: () => import('./pages/forgot-password/forgot-password.component'),
    children: [
      {
        path: FORGOT_PASSWORD_PAGES.USER_VALIDATION,
        loadComponent: () => import('./components/user-validation/user-validation.component')
      },
      {
        path: FORGOT_PASSWORD_PAGES.CODE_VERIFICATION,
        loadComponent: () => import('./components/verify-code/verify-code.component')
      },
      {
        path: FORGOT_PASSWORD_PAGES.PASSWORD_RESET,
        loadComponent: () => import('./components/password-reset/password-reset.component')
      },
      {
        path: FORGOT_PASSWORD_PAGES.SUCCESS,
        loadComponent: () => import('./components/success/success.component')
      },
      {
        path: '',
        redirectTo: FORGOT_PASSWORD_PAGES.USER_VALIDATION,
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '**',
    redirectTo: FORGOT_PASSWORD_PAGES.FORGOT_PASSWORD,

  }
  

];


export default forgotPasswordRoutes;
