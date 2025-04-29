import { Routes } from '@angular/router';

export enum DEBT_PAGES {
  DEUDAS = 'deudas',
  DEBT_SEGUIMIENTO = 'deudas-seguimiento',
  DEBT_STRATEGY = 'deudas-strategy',
}

export const debtRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: DEBT_PAGES.DEUDAS,
        loadComponent: () =>
          import('../debt/pages/register-debt/register-debt.component'),
      },
      {
        path: DEBT_PAGES.DEBT_SEGUIMIENTO,
        loadComponent: () => import('./pages/list-debt/list-debt.component'),
      },
      {
        path: DEBT_PAGES.DEBT_STRATEGY,
        loadComponent: () => import('./pages/strategy/strategy.component'),
      },
      {
        path: `${DEBT_PAGES.DEBT_SEGUIMIENTO}/:strategy`,
        loadComponent: () => import('./pages/strategy/strategy.component'),
      },
    ],
  },
];
export default debtRoutes;
