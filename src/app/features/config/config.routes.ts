import { Routes } from '@angular/router';

export enum CONFIG_PAGES_CONFIGURATION {
  CONFIGURACION = 'configuracion',
  PERFIL = 'perfil',
  SINCRONIZAR = 'sincronizar',
  DISPOSITIVOS = 'dispositivos',
  CONTRASENA = 'clave',
  NOTIFICACIONES = 'notificaciones',
  SINCRONIZAR_GOOGLE = 'sincronizar-google',
}

export const configRoutes: Routes = [
  {
    path: CONFIG_PAGES_CONFIGURATION.CONFIGURACION,
    loadComponent: () =>
      import('./pages/config/config.component').then((m) => m.ConfigComponent),

    children: [
      {
        path: CONFIG_PAGES_CONFIGURATION.PERFIL,
        loadComponent: () =>
          import('./components/tab-profile/tab-profile.component'),
      },
      {
        path: CONFIG_PAGES_CONFIGURATION.SINCRONIZAR_GOOGLE,
        loadComponent: () =>
          import('./components/tab-google/tab-google.component'),
      },
      {
        path: CONFIG_PAGES_CONFIGURATION.DISPOSITIVOS,
        loadComponent: () =>
          import('./components/tab-device/tab-device.component'),
      },
      {
        path: CONFIG_PAGES_CONFIGURATION.CONTRASENA,
        loadComponent: () =>
          import('./components/tab-password/tab-password.component'),
      },
      {
        path: CONFIG_PAGES_CONFIGURATION.NOTIFICACIONES,
        loadComponent: () =>
          import('./components/tab-notification/tab-notification.component'),
      },

      {
        path: '',
        redirectTo: CONFIG_PAGES_CONFIGURATION.PERFIL,
        pathMatch: 'full',
      },
    ],
  },
];
export default configRoutes;
