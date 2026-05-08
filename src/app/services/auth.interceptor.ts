import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('admin_token');
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
        localStorage.removeItem('admin_token');
        router.navigate(['/admin/login']);
      }

      return throwError(() => error);
    })
  );
};
