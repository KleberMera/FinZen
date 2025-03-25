import { Routes } from '@angular/router';

export enum AUTH_PAGES {
  LOGIN = '',
  SIGNUP = 'sign-up',
  FORGOTPASSWORD = 'forgot-password',
}

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AUTH_PAGES.LOGIN,
      },
      {
        path: AUTH_PAGES.LOGIN,
        loadComponent: () => import('./pages/login/login.component'),
      },
      {
        path: AUTH_PAGES.SIGNUP,
        loadComponent: () => import('./pages/sign-up/sign-up.component'),
      },
      {
        path: AUTH_PAGES.FORGOTPASSWORD,
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: AUTH_PAGES.LOGIN,
  },
];


export default authRoutes;
