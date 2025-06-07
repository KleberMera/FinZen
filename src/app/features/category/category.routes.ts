import { Routes } from '@angular/router';

export enum CATEGORY_PAGES {
  CATEGORIAS = 'categorias',

}

export const categoryRoutes: Routes = [
  {
    path: '',
    children: [
     
        {
            path: CATEGORY_PAGES.CATEGORIAS,
            loadComponent: () =>
              import('./pages/category/category.component')
          },
    ],
  },
];
export default categoryRoutes;
