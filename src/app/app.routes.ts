import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Feedback } from './pages/feedback/feedback';
import { Offers } from './pages/offers/offers';
import { ContactPage } from './pages/contact/contact';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminOfferForm } from './admin/admin-offer-form/admin-offer-form';
import { AdminOffers } from './admin/admin-offers/admin-offers';
import { AdminProductForm } from './admin/admin-product-form/admin-product-form';
import { AdminProducts } from './admin/admin-products/admin-products';
import { AdminFeedback } from './admin/admin-feedback/admin-feedback';
import { AdminInquiries } from './admin/admin-inquiries/admin-inquiries';
import { AdminSettings } from './admin/admin-settings/admin-settings';
import { adminAuthGuard } from './admin/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'feedback', component: Feedback },
  { path: 'offers', component: Offers },
  { path: 'contact', component: ContactPage },
  {
    path: 'admin',
    children: [
      { path: 'login', component: AdminLogin },
      {
        path: '',
        component: AdminLayout,
        canActivate: [adminAuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: AdminDashboard },
          { path: 'products', component: AdminProducts },
          { path: 'products/add', component: AdminProductForm },
          { path: 'products/new', redirectTo: 'products/add', pathMatch: 'full' },
          { path: 'products/:id/edit', component: AdminProductForm },
          { path: 'offers', component: AdminOffers },
          { path: 'offers/new', component: AdminOfferForm },
          { path: 'offers/:id/edit', component: AdminOfferForm },
          { path: 'inquiries', component: AdminInquiries },
          { path: 'feedback', component: AdminFeedback },
          { path: 'settings', component: AdminSettings },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' }
];
