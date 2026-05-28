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
  private readonly maxImageDimension = 1200;
  private readonly imageQuality = 0.82;

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
  readonly imagePreview = signal<string | null>(null);
  readonly selectedImageName = signal<string | null>(null);

  private readonly productId = this.route.snapshot.paramMap.get('id');
  private loadedProduct: ProductItem | null = null;

  readonly productForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required]],
    weight: ['', [Validators.required]],
    material: ['', [Validators.required]],
    availability: ['In stock', [Validators.required]],
  });

  constructor() {
    this.isEditMode.set(this.productId !== null);

    if (this.productId) {
      this.loadProduct(this.productId);
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
            weight: this.loadedProduct.weight,
            material: this.loadedProduct.material,
            availability: this.loadedProduct.availability,
          });
          this.imagePreview.set(this.loadedProduct.imageUrl);
          this.selectedImageName.set(this.loadedProduct.imageUrl ? 'Current product image' : null);
        }

        this.isLoading.set(false);
      });
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please choose a valid image file.');
      input.value = '';
      return;
    }

    try {
      const imageDataUrl = await this.resizeImage(file);
      this.imagePreview.set(imageDataUrl);
      this.selectedImageName.set(`${file.name} (optimized)`);
      this.errorMessage.set(null);
    } catch {
      this.errorMessage.set('Product image could not be processed. Please choose a JPG, PNG, or WebP image.');
      input.value = '';
    }
  }

  clearImage(): void {
    this.imagePreview.set(null);
    this.selectedImageName.set(null);
  }

  private toPayload(): ProductPayload {
    const rawValue = this.productForm.getRawValue();
    const imageUrl = this.imagePreview();

    return {
      name: rawValue.name?.trim() ?? '',
      category: rawValue.category?.trim() ?? '',
      description: rawValue.description?.trim() ?? '',
      price: rawValue.price?.trim() ?? '',
      weight: rawValue.weight?.trim() ?? '',
      material: rawValue.material?.trim() ?? '',
      imageUrl,
      images: imageUrl ? [imageUrl] : [],
      availability: rawValue.availability?.trim() ?? 'Available for inquiry',
    };
  }

  private resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const scale = Math.min(
          1,
          this.maxImageDimension / Math.max(image.naturalWidth, image.naturalHeight)
        );
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Canvas is unavailable.'));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', this.imageQuality));
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image could not be loaded.'));
      };

      image.src = objectUrl;
    });
  }

  private toPreviewProduct(payload: ProductPayload): ProductItem {
    const id = this.loadedProduct?.id ?? this.productId ?? this.slugify(payload.name);

    return {
      id,
      ...payload,
    };
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
