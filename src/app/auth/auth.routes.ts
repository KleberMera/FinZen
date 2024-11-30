import { Routes } from "@angular/router";


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component')
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./sign-up/sign-up.component')
    }
]


export default routes;