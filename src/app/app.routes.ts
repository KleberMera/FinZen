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
              import('./features/dashboard/pages/overview/overview.component'),
          },
          {
            path: '',
            loadChildren: () =>
              import('./features/transaction/transaaction.routes'),
          },
          {
            path: '',
            loadChildren: () => import('./features/debt/debt.routes'),
          },
          {
            path: '',
            loadChildren: () => import('./features/config/config.routes'),
          },
          {
            path: '',
            loadChildren: () => import('./features/goals/goal.routes'),
          },
          {
            path: '',
            loadChildren: () => import('./features/chat/chat.routes'),
          },
          {
            path: '',
            loadChildren: () => import('./features/category/category.routes'),
          },
          {
            path:'',
            loadChildren: () => import('./features/grafic/grafic.routes'),
          },
          {
            path:'',
            loadChildren: () => import('./features/strategy/strategy.routes'),
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
