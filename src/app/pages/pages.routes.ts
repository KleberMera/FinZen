import { Routes } from '@angular/router';
import LayoutComponent from '../layout/layout.component';

import { SalesComponent } from './sales/sales.component';
import { TransaccionesComponent } from './transacciones/transacciones.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriasComponent } from './categorias/categorias.component';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'transacciones',
        component: TransaccionesComponent,
      },
      {
        path: 'categorias',
        component: CategoriasComponent,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  }
];