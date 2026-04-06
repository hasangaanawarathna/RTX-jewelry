import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Feedback } from './pages/feedback/feedback';
import { Offers } from './pages/offers/offers';
import { DesignRequest } from './pages/design-request/design-request';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'feedback', component: Feedback },
  { path: 'offers', component: Offers },
  { path: 'design-request', component: DesignRequest },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/dashboard', component: AdminDashboard }
];
