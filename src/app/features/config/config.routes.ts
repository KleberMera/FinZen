import { Routes } from '@angular/router';

export enum CONFIG_PAGES {
  CONFIGURACION = 'configuracion',
  //MOVIMIENTOS = 'movimientos',
}

export const transactionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: CONFIG_PAGES.CONFIGURACION,
        loadComponent: () =>
          import('./pages/config/config.component').then(
            (m) => m.ConfigComponent
          ),
      },
    ],
  },
];
export default transactionRoutes;
