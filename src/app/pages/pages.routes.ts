import { Routes } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },

      {
        path: 'categorias',
        loadComponent: () =>
          import('./category/category.component').then(
            (m) => m.CategoryComponent
          ),
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./sales/sales.component').then((m) => m.SalesComponent),
      },

      // {
      //   path: 'transacciones',
      //   loadComponent: () =>
      //     import(
      //       '../features/transaction/pages/form-transactions/form-transactions.component'
      //     ),
      // },
      // {
      //   path: 'movimientos',
      //   loadComponent: () =>
      //     import(
      //       '../features/transaction/pages/table-transaction/table-transaction.component'
      //     ),
      // },
      {
        path: 'graficas',
        loadComponent: () =>
          import('./charts-finance/charts-finance.component').then(
            (m) => m.ChartsFinanceComponent
          ),
      },
      // {
      //   path: 'deudas',
      //   loadComponent: () =>
      //     import('./debt/ui/register-debt/register-debt.component').then(
      //       (m) => m.RegisterDebtComponent
      //     ),
      // },
      // {
      //   path: 'deudas-seguimiento',
      //   loadComponent: () =>
      //     import('./debt/ui/list-debt/list-debt.component').then(
      //       (m) => m.ListDebtComponent
      //     ),
      // },
      {
        path: 'metas',
        loadComponent: () =>
          import('./goals/ui/register-meta/register-meta.component').then(
            (m) => m.RegisterMetaComponent
          ),
      },
     
      {
        path: 'chat',
        loadComponent: () =>
          import('./chat/ui/chat/chat.component').then((m) => m.ChatComponent),
      },
      {
        path: '',
        loadChildren: () =>
          import('../features/transaction/transaaction.routes').then(
            (m) => m.transactionRoutes
          ),
      },

      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];

export default pagesRoutes;
