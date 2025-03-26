import { Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsFinanceComponent } from './charts-finance/charts-finance.component';
import { CategoryComponent } from './category/category.component';

import { RegisterDebtComponent } from './debt/ui/register-debt/register-debt.component';
import { ListDebtComponent } from './debt/ui/list-debt/list-debt.component';
import { LayoutComponent } from '../layout/layout.component';
import { ChatComponent } from './chat/ui/chat/chat.component';
import { RegisterMetaComponent } from './goals/ui/register-meta/register-meta.component';
import { ConfigComponent } from './config/ui/config/config.component';
import FormTransactionsComponent from '../features/transaction/pages/form-transactions/form-transactions.component';
import TableTransactionComponent from '../features/transaction/pages/table-transaction/table-transaction.component';

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
      {
        path: 'transacciones',
        loadComponent: () =>
          import(
            '../features/transaction/pages/form-transactions/form-transactions.component'
          ),
      },
      {
        path: 'movimientos',
        loadComponent: () =>
          import(
            '../features/transaction/pages/table-transaction/table-transaction.component'
          ),
      },
      {
        path: 'graficas',
        loadComponent: () =>
          import('./charts-finance/charts-finance.component').then(
            (m) => m.ChartsFinanceComponent
          ),
      },
      {
        path: 'deudas',
        loadComponent: () =>
          import('./debt/ui/register-debt/register-debt.component').then(
            (m) => m.RegisterDebtComponent
          ),
      },
      {
        path: 'deudas-seguimiento',
        loadComponent: () =>
          import('./debt/ui/list-debt/list-debt.component').then(
            (m) => m.ListDebtComponent
          ),
      },
      {
        path: 'metas',
        loadComponent: () =>
          import('./goals/ui/register-meta/register-meta.component').then(
            (m) => m.RegisterMetaComponent
          ),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./config/ui/config/config.component').then(
            (m) => m.ConfigComponent
          ),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./chat/ui/chat/chat.component').then((m) => m.ChatComponent),
      },

      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];

export default pagesRoutes;
