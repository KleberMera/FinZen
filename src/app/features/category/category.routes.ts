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
              import('./category.component').then(
                (m) => m.CategoryComponent
              ),
          },
    ],
  },
];
export default categoryRoutes;
