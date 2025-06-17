import { CanActivateFn } from '@angular/router';
import { ROLE } from './rol';
import { inject } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';

export const hasRoleGuard = (roles: ROLE[]): CanActivateFn => {
  return () => {
    const storage = inject(StorageService);
    const _router = inject(Router);
    const userRole = storage.getRole();
    console.log(userRole);
    if (!roles.includes(userRole)) {
      //console.log('No tienes permiso');

      _router.navigateByUrl('/home');
      return false;
    }

    return true;
  };
};
