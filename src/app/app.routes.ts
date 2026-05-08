import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Feedback } from './pages/feedback/feedback';
import { Offers } from './pages/offers/offers';
import { ContactPage } from './pages/contact/contact';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminOfferForm } from './admin/admin-offer-form/admin-offer-form';
import { AdminOffers } from './admin/admin-offers/admin-offers';
import { AdminProductForm } from './admin/admin-product-form/admin-product-form';
import { AdminProducts } from './admin/admin-products/admin-products';
import { AdminFeedback } from './admin/admin-feedback/admin-feedback';
import { AdminInquiries } from './admin/admin-inquiries/admin-inquiries';
import { adminAuthGuard } from './admin/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'feedback', component: Feedback },
  { path: 'offers', component: Offers },
  { path: 'contact', component: ContactPage },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [adminAuthGuard] },
  { path: 'admin/products', component: AdminProducts, canActivate: [adminAuthGuard] },
  { path: 'admin/products/new', component: AdminProductForm, canActivate: [adminAuthGuard] },
  { path: 'admin/products/:id/edit', component: AdminProductForm, canActivate: [adminAuthGuard] },
  { path: 'admin/offers', component: AdminOffers, canActivate: [adminAuthGuard] },
  { path: 'admin/offers/new', component: AdminOfferForm, canActivate: [adminAuthGuard] },
  { path: 'admin/offers/:id/edit', component: AdminOfferForm, canActivate: [adminAuthGuard] },
  { path: 'admin/feedback', component: AdminFeedback, canActivate: [adminAuthGuard] },
  { path: 'admin/inquiries', component: AdminInquiries, canActivate: [adminAuthGuard] },
  { path: '**', redirectTo: '' }
];
