import { CanActivateFn, Router } from '@angular/router';
import { STORED_KEYS } from '../constants/storedKeys';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const plat_id = inject(PLATFORM_ID);
  const router = inject(Router);
  if (isPlatformBrowser(plat_id)) {
    const token = localStorage.getItem(STORED_KEYS.userToken);
    if (token) {
      return true;
    }
    return router.createUrlTree(['/login']);
  }
  return true;
};
