import { Routes } from '@angular/router';

export enum TRANSACTION_PAGES {
  TRANSACCIONES = 'transacciones',
  MOVIMIENTOS = 'movimientos',
}

export const transactionRoutes: Routes = [
  {
    path: TRANSACTION_PAGES.TRANSACCIONES,
    loadComponent: () =>
      import('./pages/form-transactions/form-transactions.component'),
  },
  {
    path: TRANSACTION_PAGES.MOVIMIENTOS,
    loadComponent: () =>
      import('./pages/table-transaction/table-transaction.component'),
  },
];

export default transactionRoutes;
