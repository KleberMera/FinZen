import { Routes } from '@angular/router';

export enum STRATEGY_PAGES {
  STRATEGY = 'estrategia',
  SNOWBALL = 'bola-de-nieve',
  AVALANCHE = 'avalancha',
  SELECTION_DATA = 'seleccion-datos',
}

export const strategyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: STRATEGY_PAGES.STRATEGY,
        loadComponent: () =>
          import('./components/strategy-main/strategy-main.component'),
        children: [
          {
            path: STRATEGY_PAGES.SNOWBALL,
            loadComponent: () =>
              import('./components/tab-snowball/tab-snowball.component'),
          },
          {
            path: STRATEGY_PAGES.AVALANCHE,
            loadComponent: () =>
              import('./components/tab-avalanche/tab-avalanche.component'),
          },
          {
            path: STRATEGY_PAGES.SELECTION_DATA,
            loadComponent: () =>
              import('./components/sidebar-selected-debts/sidebar-selected-debts.component'),
          },
        ],
      },
    ],
  },
];

export default strategyRoutes;
