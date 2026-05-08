import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuth } from '../../services/admin-auth';
import { Toast } from '../../services/toast';

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
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(Toast);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    if (this.adminAuth.isAuthenticated()) {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

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
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.toast.success('Admin login successful.');
          this.router.navigateByUrl(returnUrl && returnUrl.startsWith('/admin') ? returnUrl : '/admin/dashboard');
          return;
        }

        this.toast.error(result.message ?? 'Login failed. Check username and password.');
        this.errorMessage.set(result.message ?? 'Login failed. Check username and password.');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.error('Unable to login right now. Please try again.');
        this.errorMessage.set('Unable to login right now. Please try again.');
      }
    });
  }
}
