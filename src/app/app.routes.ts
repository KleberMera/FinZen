import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { hasRoleGuard } from './core/guards/has-role.guard';
import { ROLE } from './core/guards/rol';
export enum FEATURE_PAGES {
  AUTH = 'auth',
  HOME = 'home',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
       // canMatch: [publicGuard],
        path: '',
        pathMatch: 'full',
        redirectTo: FEATURE_PAGES.AUTH,
      },
      {
       canMatch: [publicGuard],
        path: FEATURE_PAGES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes'),
      },

      {
        canMatch: [authGuard],
        path: FEATURE_PAGES.HOME,
        component: LayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dashboard', // Redirige a "dashboard" cuando accedas a "HOME" sin ruta específica.
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT, ROLE.ADMIN])],
            path: 'dashboard',
            loadComponent: () =>
              import('./features/dashboard/pages/overview/overview.component'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT, ROLE.ADMIN])],
            path: '',
            loadChildren: () =>
              import('./features/transaction/transaaction.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT, ROLE.ADMIN])],
            path: '',
            loadChildren: () => import('./features/debt/debt.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT, ROLE.ADMIN])],
            path: '',
            loadChildren: () => import('./features/config/config.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT, ROLE.ADMIN])],
            path: '',
            loadChildren: () => import('./features/goals/goal.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT])],
            path: '',
            loadChildren: () => import('./features/chat/chat.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT])],
            path: '',
            loadChildren: () => import('./features/category/category.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT])],
            path:'',
            loadChildren: () => import('./features/grafic/grafic.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.CLIENT, ROLE.ADMIN])],
            path:'',
            loadChildren: () => import('./features/strategy/strategy.routes'),
          },
          {
            canActivate: [hasRoleGuard([ROLE.ADMIN])],
            path:'',
            loadChildren: () => import('./features/admin/user-management/admin.routes'),
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
