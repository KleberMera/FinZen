import { Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsFinanceComponent } from './charts-finance/charts-finance.component';
import { DeudasComponent } from './deudas/deudas.component';
import LayoutComponent from '../layout/layout.component';
import { CategoryComponent } from './category/category.component';
import { TransactionComponent } from './transaction/transaction.component';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'categorias',
        component: CategoryComponent,
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'transacciones',
        component: TransactionComponent,
      },
      {
        path: 'graficas',
        component: ChartsFinanceComponent,
      },
      {
        path: 'deudas',
        component: DeudasComponent,
      },

      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
