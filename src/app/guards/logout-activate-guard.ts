import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Auth } from '../auth/services/auth';

export const logoutActivateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(Auth)
    .isLogged()
    .pipe(map((logged) => !logged || router.createUrlTree(['/products'])));
};