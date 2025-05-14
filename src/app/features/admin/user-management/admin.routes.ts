import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { hasRoleGuard } from '../../../core/guards/has-role.guard';
import { ROLE } from '../../../core/guards/rol';

export enum ADMIN_PAGES {
  USER_MANAGEMENT = 'gestion-usuarios',
}

export const adminRoutes: Routes = [
  {
    canMatch: [authGuard],
    canActivate: [hasRoleGuard([ROLE.ADMIN])],
    path: '',
    children: [
      {
        path: ADMIN_PAGES.USER_MANAGEMENT,
        loadComponent: () =>
          import('./pages/user-management/user-management.component'),
      },
    ],
  },
];

export default adminRoutes;
