import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { pagesRoutes } from './pages/pages.routes';


export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: 'home',
    children: pagesRoutes,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  }
];