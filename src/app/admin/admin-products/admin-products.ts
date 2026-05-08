import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { getApiErrorMessage } from '../../services/api-error';
import { Product, ProductItem } from '../../services/product';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProducts {
  private readonly productService = inject(Product);
  private readonly toast = inject(Toast);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly products = signal<ProductItem[]>([]);
  readonly isLoading = signal(true);
  readonly deletingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService
      .getProducts()
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Products could not be loaded.'));
          this.toast.info('Showing saved frontend preview products.');
          return of(this.previewStore.getProducts());
        })
      )
      .subscribe((items) => {
        this.products.set(items);
        this.previewStore.saveProducts(items);
        this.isLoading.set(false);
      });
  }

  deleteProduct(product: ProductItem): void {
    const confirmed = window.confirm(`Delete "${product.name}"? This action cannot be undone.`);

    if (!confirmed || this.deletingId()) {
      return;
    }

    this.deletingId.set(product.id);
    this.errorMessage.set(null);

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.update((items) => items.filter((item) => item.id !== product.id));
        this.previewStore.removeProduct(product.id);
        this.deletingId.set(null);
        this.toast.success('Product deleted successfully.');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          const nextItems = this.previewStore.removeProduct(product.id);
          this.products.set(nextItems);
          this.toast.info('Backend unavailable. Product removed from the frontend preview.');
        } else {
          this.errorMessage.set(getApiErrorMessage(error, 'Product could not be deleted.'));
          this.toast.error(this.errorMessage() ?? 'Product could not be deleted.');
        }

        this.deletingId.set(null);
      },
    });
  }
}
