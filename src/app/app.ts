import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { ToastContainer } from './components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly isAdminRoute = signal(false);

  constructor(private readonly router: Router) {
    this.isAdminRoute.set(this.isAdminUrl(this.router.url));
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.isAdminRoute.set(this.isAdminUrl(event.urlAfterRedirects)));
  }

  private isAdminUrl(url: string): boolean {
    return url === '/admin' || url.startsWith('/admin/');
  }
}
