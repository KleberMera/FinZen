import { Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsFinanceComponent } from './charts-finance/charts-finance.component';

import { CategoryComponent } from './category/category.component';
import { TableTransactionComponent } from './transaction/ui/table-transaction/table-transaction.component';
import { FormTransactionsComponent } from './transaction/ui/form-transactions/form-transactions.component';
import { RegisterDebtComponent } from './debt/ui/register-debt/register-debt.component';
import { ListDebtComponent } from './debt/ui/list-debt/list-debt.component';
import { EditDebtComponent } from './debt/ui/edit-debt/edit-debt.component';
import { LayoutComponent } from '../layout/layout.component';

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
        component: RegisterDebtComponent,
      },
      {
        path: 'deudas-listado',
        component: ListDebtComponent,
      },
      {
        path: 'deudas-pagar',
        component: EditDebtComponent,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
