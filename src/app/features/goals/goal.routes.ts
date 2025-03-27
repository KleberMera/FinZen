import { Routes } from '@angular/router';

export enum CONFIG_PAGES {
  METAS = 'metas',
  //MOVIMIENTOS = 'movimientos',
}

export const goalRoutes: Routes = [
  {
    path: '',
    children: [
        {
            path: CONFIG_PAGES.METAS,
            loadComponent: () =>
              import('./pages/register-meta/register-meta.component').then(
                (m) => m.RegisterMetaComponent
              ),
          },
         
    ],
  },
];
export default goalRoutes;
