import { Routes } from '@angular/router';
export enum FEATURE_PAGES {
  AUTH = 'auth',
  HOME = 'home',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: FEATURE_PAGES.AUTH,
        // loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
      },
      {
        path: FEATURE_PAGES.AUTH,
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.authRoutes),
      },
      {
        path: FEATURE_PAGES.HOME,
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.pagesRoutes),
      },
      {
        path: '**',
        redirectTo: FEATURE_PAGES.AUTH,
      },
      {
        path: '**',
        redirectTo: FEATURE_PAGES.HOME,
      },
    ],
  },
];
