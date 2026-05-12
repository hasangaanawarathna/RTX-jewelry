import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Toast } from '../../services/toast';

interface AdminNavItem {
  label: string;
  route: string;
  mark: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  readonly pageTitle = signal(this.resolveTitle(this.router.url));
  readonly navItems: AdminNavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', mark: 'D' },
    { label: 'Manage Products', route: '/admin/products', mark: 'P' },
    { label: 'Add Product', route: '/admin/products/add', mark: '+' },
    { label: 'Manage Offers', route: '/admin/offers', mark: 'O' },
    { label: 'Customer Inquiries', route: '/admin/inquiries', mark: 'I' },
    { label: 'Feedback', route: '/admin/feedback', mark: 'F' },
    { label: 'Settings', route: '/admin/settings', mark: 'S' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.pageTitle.set(this.resolveTitle(event.urlAfterRedirects)));
  }

  logout(): void {
    this.auth.logout();
    this.toast.info('Admin logged out.');
    this.router.navigateByUrl('/admin/login');
  }

  private resolveTitle(url: string): string {
    if (url.includes('/products/add')) {
      return 'Add Product';
    }

    if (url.includes('/products') && url.includes('/edit')) {
      return 'Edit Product';
    }

    if (url.includes('/products')) {
      return 'Manage Products';
    }

    if (url.includes('/offers')) {
      return 'Manage Offers';
    }

    if (url.includes('/inquiries')) {
      return 'Customer Inquiries';
    }

    if (url.includes('/feedback')) {
      return 'Feedback';
    }

    if (url.includes('/settings')) {
      return 'Settings';
    }

    return 'Admin Dashboard';
  }
}
