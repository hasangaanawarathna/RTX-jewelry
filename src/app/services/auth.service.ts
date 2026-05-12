import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

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
  private readonly demoUsername = 'admin';
  private readonly demoPassword = 'admin123';

  readonly token = signal<string | null>(this.readStoredToken());

  login(payload: AdminLoginPayload): Observable<AdminLoginResult> {
    return of(this.validateDemoLogin(payload)).pipe(
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
}
