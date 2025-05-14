import { CanActivateFn } from '@angular/router';
import { ROLE } from './rol';
import { inject } from '@angular/core';
import { StorageService } from '@services/storage.service';

export const hasRoleGuard = (roles: ROLE[]): CanActivateFn => {
  return () => {
    const storage = inject(StorageService);
    const userRole = storage.getRole();
    console.log(userRole);
    return roles.includes(userRole);
  };
};
