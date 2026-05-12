import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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

  readonly navItems: AdminNavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', mark: 'D' },
    { label: 'Manage Products', route: '/admin/products', mark: 'P' },
    { label: 'Add Product', route: '/admin/products/add', mark: '+' },
    { label: 'Manage Offers', route: '/admin/offers', mark: 'O' },
    { label: 'Customer Inquiries', route: '/admin/inquiries', mark: 'I' },
    { label: 'Feedback', route: '/admin/feedback', mark: 'F' },
    { label: 'Settings', route: '/admin/settings', mark: 'S' },
  ];

  logout(): void {
    this.auth.logout();
    this.toast.info('Admin logged out.');
    this.router.navigateByUrl('/admin/login');
  }
}
