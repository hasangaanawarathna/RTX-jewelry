import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export const ADMIN_AUTH_TOKEN_KEY = 'admin_token';
export const ADMIN_AUTH_SESSION_KEY = 'rtx_admin_session';

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminLoginResult {
  success: boolean;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loginApiUrl = `${environment.apiBaseUrl}/admin/login`;

  readonly token = signal<string | null>(this.readStoredToken());

  login(payload: AdminLoginPayload): Observable<AdminLoginResult> {
    return this.http.post<unknown>(this.loginApiUrl, payload).pipe(
      map((response) => this.toLoginResult(response)),
      tap((result) => {
        if (result.success && result.token) {
          this.storeToken(result.token);
        }
      }),
      catchError(() =>
        of({
          success: false,
          message: 'Login failed. Check admin username and password.',
        })
      )
    );
  }

  logout(): void {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    const storedToken = this.readStoredToken();

    if (storedToken !== this.token()) {
      this.token.set(storedToken);
    }

    return storedToken;
  }

  private readStoredToken(): string | null {
    const localToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
    const sessionToken = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
    const token = localToken ?? sessionToken;
    return token && token.trim().length > 0 ? token : null;
  }

  private storeToken(token: string): void {
    localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, token);
    this.token.set(token);
  }

  private toLoginResult(response: unknown): AdminLoginResult {
    if (response !== null && typeof response === 'object') {
      const row = response as Record<string, unknown>;
      const token = typeof row['token'] === 'string' ? row['token'] : undefined;
      const message = typeof row['message'] === 'string' ? row['message'] : undefined;

      return {
        success: row['success'] === true && Boolean(token),
        token,
        message,
      };
    }

    return {
      success: false,
      message: 'Login failed. Check admin username and password.',
    };
  }
}
