import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '@services/auth-state.service';
import { toast } from 'ngx-sonner';

export const authGuard: CanMatchFn = (route, segments) => {
  const authState = inject(AuthStateService);

  const token = authState.getSession();
  const _router = inject(Router);

  if (token) {
    return true;
  }

  _router.navigateByUrl('/auth');
  toast.error('Sin Autorización');
  return false;
};


export const publicGuard: CanMatchFn = (route, segments) => {
  const authState = inject(AuthStateService);

  const token = authState.getSession();
  const _router = inject(Router);

  if (!token) {
    return true;
  }

  _router.navigateByUrl('/home');
  return false;
};