import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuth } from '../../services/admin-auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private readonly formBuilder = inject(FormBuilder);
  private readonly adminAuth = inject(AdminAuth);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitLogin(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.adminAuth.login({
      username: username ?? '',
      password: password ?? '',
    }).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        if (result.success) {
          if (result.token) {
            localStorage.setItem('admin_token', result.token);
          }
          this.router.navigateByUrl('/admin/dashboard');
          return;
        }

        this.errorMessage.set(result.message ?? 'Login failed. Check username and password.');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Unable to login right now. Please try again.');
      }
    });
  }
}
