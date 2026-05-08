import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DEMO_PRODUCTS } from '../../data/demo-store';
import { Product, ProductItem } from '../../services/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(Product);

  readonly product = signal<ProductItem | null>(null);
  readonly selectedImage = signal<string | null>(null);

  readonly galleryImages = computed(() => {
    const product = this.product();

    if (!product) {
      return [];
    }

    return product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.loadProduct(params.get('id') ?? '');
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
  }

  private loadProduct(productId: string): void {
    const fallbackProduct = DEMO_PRODUCTS.find((item) => item.id === productId) ?? null;

    this.productService
      .getProductById(productId)
      .pipe(catchError(() => of(fallbackProduct)))
      .subscribe((item) => {
        const product = item ?? fallbackProduct;
        this.product.set(product);
        this.selectedImage.set(product?.imageUrl ?? product?.images[0] ?? null);
      });
  }
}
