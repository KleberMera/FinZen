import { Routes } from '@angular/router';

export enum CONFIG_PAGES {
  METAS = 'metas',
  SEGUIMIENTO = 'meta-seguimiento',
  //MOVIMIENTOS = 'movimientos',
}

export const goalRoutes: Routes = [
  {
    path: '',
    children: [

          {
            path: CONFIG_PAGES.SEGUIMIENTO,
            loadComponent: () =>
              import('./pages/goal-view/goal-view.component').then(
                (m) => m.GoalViewComponent
              ),
          },

    ],
  },
];
export default goalRoutes;
