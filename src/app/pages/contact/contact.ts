import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DEMO_PRODUCTS } from '../../data/demo-store';
import { getApiErrorMessage } from '../../services/api-error';
import { Contact, InquiryPayload } from '../../services/contact';
import { Product, ProductItem } from '../../services/product';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(Product);
  private readonly contactService = inject(Contact);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(Toast);

  readonly products = signal<ProductItem[]>(DEMO_PRODUCTS);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly inquiryForm = this.formBuilder.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    productId: ['general', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.loadProducts();
    this.route.queryParamMap.subscribe((params) => {
      const productId = params.get('product');

      if (productId) {
        this.inquiryForm.patchValue({ productId });
      }
    });
  }

  submitInquiry(): void {
    if (this.inquiryForm.invalid || this.isSubmitting()) {
      this.inquiryForm.markAllAsTouched();
      return;
    }

    const payload = this.toInquiryPayload();
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.contactService.sendInquiry(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Your inquiry has been sent. Our team will contact you soon.');
        this.toast.success('Inquiry sent successfully.');
        this.inquiryForm.reset({ productId: 'general' });
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.successMessage.set(
            'Inquiry captured for frontend preview. Connect the backend API to store and manage it.'
          );
          this.toast.info('Backend unavailable. Inquiry captured in the frontend preview.');
          this.inquiryForm.reset({ productId: 'general' });
          return;
        }

        this.errorMessage.set(getApiErrorMessage(error, 'Inquiry could not be sent.'));
        this.toast.error(this.errorMessage() ?? 'Inquiry could not be sent.');
      },
    });
  }

  private loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(catchError(() => of(DEMO_PRODUCTS)))
      .subscribe((items) => {
        if (items.length > 0) {
          this.products.set(items);
        }
      });
  }

  private toInquiryPayload(): InquiryPayload {
    const rawValue = this.inquiryForm.getRawValue();
    const productId = rawValue.productId ?? 'general';
    const selectedProduct = this.products().find((item) => item.id === productId);

    return {
      customerName: rawValue.customerName ?? '',
      phone: rawValue.phone ?? '',
      email: rawValue.email ?? '',
      productId,
      productName: selectedProduct?.name ?? 'General inquiry',
      message: rawValue.message ?? '',
    };
  }
}
