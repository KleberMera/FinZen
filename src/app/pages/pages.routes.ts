import { Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsFinanceComponent } from './charts-finance/charts-finance.component';
import { DeudasComponent } from './deudas/deudas.component';
import LayoutComponent from '../layout/layout.component';
import { CategoryComponent } from './category/category.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TableTransactionComponent } from './transaction/ui/table-transaction/table-transaction.component';
import { FormTransactionsComponent } from './transaction/ui/form-transactions/form-transactions.component';

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
        component: FormTransactionsComponent,
      },
      {
        path: 'transacciones-listado',
        component: TableTransactionComponent,
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
