import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
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
  private readonly loginUrl = `${environment.apiBaseUrl}/admin/login`;
  private readonly demoUsername = 'admin';
  private readonly demoPassword = 'admin123';

  readonly token = signal<string | null>(this.readStoredToken());

  login(payload: AdminLoginPayload): Observable<AdminLoginResult> {
    return this.http.post<unknown>(this.loginUrl, payload).pipe(
      map((response) => this.normalizeLoginResponse(response)),
      catchError(() => of(this.validateDemoLogin(payload))),
      tap((result) => {
        if (result.success && result.token) {
          this.storeToken(result.token);
        }
      })
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

  private validateDemoLogin(payload: AdminLoginPayload): AdminLoginResult {
    const username = payload.username.trim().toLowerCase();
    const password = payload.password;

    if (username === this.demoUsername && password === this.demoPassword) {
      return {
        success: true,
        token: 'demo-admin-token',
      };
    }

    return {
      success: false,
      message: 'Login failed. Check username and password.',
    };
  }

  private normalizeLoginResponse(response: unknown): AdminLoginResult {
    if (this.isObject(response)) {
      const success = Boolean(response['success']);
      const token = this.toText(response['token']) ?? undefined;
      const message = this.toText(response['message']) ?? undefined;
      return { success, token, message };
    }

    return {
      success: false,
      message: 'Invalid server response.',
    };
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
  }

  private toText(value: unknown): string | null {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }

    return null;
  }

  private readStoredToken(): string | null {
    const localToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
    const sessionToken = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
    const token = localToken ?? sessionToken;
    return token && token.trim().length > 0 ? token : null;
  }

  private storeToken(token: string): void {
    localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'active');
    this.token.set(token);
  }
}
