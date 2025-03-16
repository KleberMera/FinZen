import { Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsFinanceComponent } from './charts-finance/charts-finance.component';

import { CategoryComponent } from './category/category.component';
import { TableTransactionComponent } from './transaction/ui/table-transaction/table-transaction.component';
import { FormTransactionsComponent } from './transaction/ui/form-transactions/form-transactions.component';
import { RegisterDebtComponent } from './debt/ui/register-debt/register-debt.component';
import { ListDebtComponent } from './debt/ui/list-debt/list-debt.component';

import { LayoutComponent } from '../layout/layout.component';
import { GoalsComponent } from './goals/goals.component';
import { ChatComponent } from './chat/ui/chat/chat.component';

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
        path: 'movimientos',
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
        path: 'deudas-seguimiento',
        component: ListDebtComponent,
      },
      {
        path: 'metas',
        component: GoalsComponent
      },
      {
        path: 'chat',
        component: ChatComponent
      },

      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
