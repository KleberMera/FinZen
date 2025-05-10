import { Routes } from '@angular/router';

export enum STRATEGY_PAGES {
  STRATEGY = 'estrategia',
  SNOWBALL = 'bola-de-nieve',
  AVALANCHE = 'avalancha',
  SELECTION_DATA = 'seleccion-datos',
  PLAN = 'plan'
}

export const strategyRoutes: Routes = [
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
          {
            path: '',
            pathMatch: 'full',
            redirectTo: STRATEGY_PAGES.SNOWBALL,
          },
        ],
      },
      {
        path: STRATEGY_PAGES.PLAN,
        loadComponent: () =>
          import('./components/strategy-plan/strategy-plan.component'),
      },
      {
        path: '**',
        redirectTo: STRATEGY_PAGES.SNOWBALL,
      }
    ]




export default strategyRoutes;
