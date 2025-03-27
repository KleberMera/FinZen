import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
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
      },
      {
        path: FEATURE_PAGES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes'),
      },
      {
        path: FEATURE_PAGES.HOME,
        component: LayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dashboard', // Redirige a "dashboard" cuando accedas a "HOME" sin ruta específica.
          },

          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('./features/transaction/transaaction.routes').then(
                (m) => m.transactionRoutes
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('./features/debt/debt.routes').then(
                (m) => m.transactionRoutes
              ),
          },
          {
            path: '**',
            redirectTo: 'dashboard',
          },
        ],
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
