import { Routes } from '@angular/router';

export enum GRAFICS_PAGES {
  GRAFICOS = 'estadisticas',
  //MOVIMIENTOS = 'movimientos',
}

export const graficsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: GRAFICS_PAGES.GRAFICOS,
        loadComponent: () => import('./pages/grafics/grafics.component'),
      },
    ],
  },
];
export default graficsRoutes;
