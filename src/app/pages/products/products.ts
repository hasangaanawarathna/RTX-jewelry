import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DEMO_PRODUCTS } from '../../data/demo-store';
import { Product, ProductItem } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private readonly productService = inject(Product);

  readonly categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal Collections'];
  readonly products = signal<ProductItem[]>(DEMO_PRODUCTS);
  readonly selectedCategory = signal('All');
  readonly searchTerm = signal('');
  readonly isLoading = signal(true);

  readonly filteredProducts = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const selectedCategory = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  });

  constructor() {
    this.loadProducts();
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  private loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(catchError(() => of(DEMO_PRODUCTS)))
      .subscribe((items) => {
        this.isLoading.set(false);

        if (items.length > 0) {
          this.products.set(items);
        }
      });
  }
}
