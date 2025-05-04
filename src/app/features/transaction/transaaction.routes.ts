import { Routes } from '@angular/router';

export enum TRANSACTION_PAGES {
  ROOT = 'transacciones',
  REGISTRO = 'registro',
  MOVIMIENTOS = 'movimientos',
  RECURRENTES = 'recurrentes',
}

export interface Root {
  trasaccion: Trasaccion
}

export interface Trasaccion {
  registro: string
  recurrentes: string
  movimientos: string
}


export const transactionRoutes: Routes = [
  {
    path:  TRANSACTION_PAGES.ROOT,
    children: [
      {
        path: TRANSACTION_PAGES.REGISTRO,
        loadComponent: () =>
          import('./pages/form-transactions/form-transactions.component'),
      },
      {
        path: TRANSACTION_PAGES.MOVIMIENTOS,
        loadComponent: () =>
          import('./pages/table-transaction/table-transaction.component'),
      },
      {
        path: TRANSACTION_PAGES.RECURRENTES,
        loadComponent: () =>
          import('./pages/recurrent/recurrent.component'),
      },
    ],
  },
];
export default transactionRoutes;
