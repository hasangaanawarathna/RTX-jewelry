import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminAuth } from './admin-auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AdminAuth);
  const router = inject(Router);
  const token = auth.getToken();
  const isApiRequest =
    request.url.startsWith(environment.apiBaseUrl) || request.url.startsWith('/api/');

  const authRequest =
    token && isApiRequest
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : request;

  return next(authRequest).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !request.url.includes('/admin/login')
      ) {
        auth.logout();
        router.navigate(['/admin/login']);
      }

      return throwError(() => error);
    })
  );
};
