import { Routes } from '@angular/router';

export enum CHAT_PAGES {
  CHAT = 'chat',
  //MOVIMIENTOS = 'movimientos',
}

export const chatRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: CHAT_PAGES.CHAT,
        loadComponent: () =>
          import('./pages/chat/chat.component').then((m) => m.ChatComponent),
      },
    ],
  },
];
export default chatRoutes;
