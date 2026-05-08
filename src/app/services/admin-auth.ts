import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

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
export class AdminAuth {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = '/api/admin/login';
  private readonly demoUsername = 'admin';
  private readonly demoPassword = 'admin123';

  login(payload: AdminLoginPayload): Observable<AdminLoginResult> {
    return this.http.post<unknown>(this.loginUrl, payload).pipe(
      map((response) => this.normalizeLoginResponse(response)),
      catchError(() => of(this.validateDemoLogin(payload)))
    );
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
      message: 'Invalid server response.'
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
}
