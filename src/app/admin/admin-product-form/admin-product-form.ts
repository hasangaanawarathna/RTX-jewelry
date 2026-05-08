import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { getApiErrorMessage } from '../../services/api-error';
import { Product, ProductItem, ProductPayload } from '../../services/product';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(Product);
  private readonly toast = inject(Toast);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly isEditMode = signal(false);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly previewImages = signal<string[]>([]);

  private readonly productId = this.route.snapshot.paramMap.get('id');
  private loadedProduct: ProductItem | null = null;

  readonly productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required]],
    imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    imagesText: [''],
    availability: ['In stock', [Validators.required]],
  });

  constructor() {
    this.isEditMode.set(this.productId !== null);
    this.productForm.valueChanges.subscribe(() => this.updatePreviewImages());

    if (this.productId) {
      this.loadProduct(this.productId);
    } else {
      this.updatePreviewImages();
    }
  }

  submitProduct(): void {
    if (this.productForm.invalid || this.isSaving()) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    this.isSaving.set(true);
    this.errorMessage.set(null);

    const request = this.productId
      ? this.productService.updateProduct(this.productId, payload)
      : this.productService.createProduct(payload);

    request.subscribe({
      next: (item) => {
        this.previewStore.upsertProduct(item);
        this.isSaving.set(false);
        this.toast.success(this.productId ? 'Product updated successfully.' : 'Product added successfully.');
        this.router.navigateByUrl('/admin/products');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.previewStore.upsertProduct(this.toPreviewProduct(payload));
          this.isSaving.set(false);
          this.toast.info('Backend unavailable. Product saved to the frontend preview.');
          this.router.navigateByUrl('/admin/products');
          return;
        }

        this.isSaving.set(false);
        this.errorMessage.set(getApiErrorMessage(error, 'Product could not be saved.'));
        this.toast.error(this.errorMessage() ?? 'Product could not be saved.');
      },
    });
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);

    const fallbackProduct = this.previewStore.getProducts().find((item) => item.id === id) ?? null;

    this.productService
      .getProductById(id)
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Product could not be loaded.'));
          return of(fallbackProduct);
        })
      )
      .subscribe((item) => {
        this.loadedProduct = item ?? fallbackProduct;

        if (this.loadedProduct) {
          this.productForm.patchValue({
            name: this.loadedProduct.name,
            category: this.loadedProduct.category,
            description: this.loadedProduct.description,
            price: this.loadedProduct.price,
            imageUrl: this.loadedProduct.imageUrl ?? '',
            imagesText: this.loadedProduct.images.join('\n'),
            availability: this.loadedProduct.availability,
          });
        }

        this.updatePreviewImages();
        this.isLoading.set(false);
      });
  }

  private updatePreviewImages(): void {
    const rawValue = this.productForm.getRawValue();
    const imageUrl = rawValue.imageUrl?.trim();
    const images = this.parseImages(rawValue.imagesText ?? '');
    const previewImages = imageUrl ? [imageUrl, ...images.filter((item) => item !== imageUrl)] : images;

    this.previewImages.set(previewImages);
  }

  private toPayload(): ProductPayload {
    const rawValue = this.productForm.getRawValue();
    const imageUrl = rawValue.imageUrl?.trim() || null;
    const images = this.parseImages(rawValue.imagesText ?? '');

    return {
      name: rawValue.name?.trim() ?? '',
      category: rawValue.category?.trim() ?? '',
      description: rawValue.description?.trim() ?? '',
      price: rawValue.price?.trim() ?? '',
      imageUrl,
      images: imageUrl ? [imageUrl, ...images.filter((item) => item !== imageUrl)] : images,
      availability: rawValue.availability?.trim() ?? 'Available for inquiry',
    };
  }

  private toPreviewProduct(payload: ProductPayload): ProductItem {
    const id = this.loadedProduct?.id ?? this.productId ?? this.slugify(payload.name);

    return {
      id,
      ...payload,
    };
  }

  private parseImages(value: string): string[] {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private slugify(value: string): string {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return slug || `product-${Date.now()}`;
  }
}
