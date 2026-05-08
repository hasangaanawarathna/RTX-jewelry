import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuth } from '../../services/admin-auth';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  readonly auth = inject(AdminAuth);

  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  readonly isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.toast.info('Admin logged out.');
    this.router.navigateByUrl('/admin/login');
  }
}
