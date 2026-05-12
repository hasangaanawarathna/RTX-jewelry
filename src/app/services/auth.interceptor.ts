import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ADMIN_AUTH_SESSION_KEY, ADMIN_AUTH_TOKEN_KEY } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const token =
    localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) ?? sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
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
        localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
        router.navigate(['/admin/login']);
      }

      return throwError(() => error);
    })
  );
};
