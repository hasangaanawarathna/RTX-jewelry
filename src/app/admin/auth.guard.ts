import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = (_route, state) => {
  return authorizeAdminRoute(state.url);
};

export const adminAuthChildGuard: CanActivateChildFn = (_route, state) => {
  return authorizeAdminRoute(state.url);
};

function authorizeAdminRoute(url: string): boolean | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/admin/login'], {
    queryParams: {
      returnUrl: url,
    },
  });
}
