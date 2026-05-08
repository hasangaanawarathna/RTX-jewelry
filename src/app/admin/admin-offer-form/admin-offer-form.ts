import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { getApiErrorMessage } from '../../services/api-error';
import { Offer, OfferItem, OfferPayload } from '../../services/offer';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-admin-offer-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-offer-form.html',
  styleUrl: './admin-offer-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOfferForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly offerService = inject(Offer);
  private readonly toast = inject(Toast);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly isEditMode = signal(false);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private readonly offerId = this.route.snapshot.paramMap.get('id');
  private loadedOffer: OfferItem | null = null;

  readonly offerForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    discount: ['', [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(3)]],
    validFrom: ['', [Validators.required]],
    validUntil: ['', [Validators.required]],
  });

  constructor() {
    this.isEditMode.set(this.offerId !== null);

    if (this.offerId) {
      this.loadOffer(this.offerId);
    }
  }

  submitOffer(): void {
    if (this.offerForm.invalid || this.isSaving()) {
      this.offerForm.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    this.isSaving.set(true);
    this.errorMessage.set(null);

    const request = this.offerId
      ? this.offerService.updateOffer(this.offerId, payload)
      : this.offerService.createOffer(payload);

    request.subscribe({
      next: (item) => {
        this.previewStore.upsertOffer(item);
        this.isSaving.set(false);
        this.toast.success(this.offerId ? 'Offer updated successfully.' : 'Offer added successfully.');
        this.router.navigateByUrl('/admin/offers');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.previewStore.upsertOffer(this.toPreviewOffer(payload));
          this.isSaving.set(false);
          this.toast.info('Backend unavailable. Offer saved to the frontend preview.');
          this.router.navigateByUrl('/admin/offers');
          return;
        }

        this.isSaving.set(false);
        this.errorMessage.set(getApiErrorMessage(error, 'Offer could not be saved.'));
        this.toast.error(this.errorMessage() ?? 'Offer could not be saved.');
      },
    });
  }

  private loadOffer(id: string): void {
    this.isLoading.set(true);
    const fallbackOffer = this.previewStore.getOffers().find((item) => item.id === id) ?? null;

    this.offerService
      .getOfferById(id)
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Offer could not be loaded.'));
          return of(fallbackOffer);
        })
      )
      .subscribe((item) => {
        this.loadedOffer = item ?? fallbackOffer;

        if (this.loadedOffer) {
          this.offerForm.patchValue({
            title: this.loadedOffer.title,
            description: this.loadedOffer.description,
            discount: this.loadedOffer.discount,
            code: this.loadedOffer.code,
            validFrom: this.loadedOffer.validFrom,
            validUntil: this.loadedOffer.validUntil,
          });
        }

        this.isLoading.set(false);
      });
  }

  private toPayload(): OfferPayload {
    const rawValue = this.offerForm.getRawValue();

    return {
      title: rawValue.title?.trim() ?? '',
      description: rawValue.description?.trim() ?? '',
      discount: rawValue.discount?.trim() ?? '',
      code: rawValue.code?.trim().toUpperCase() ?? '',
      validFrom: rawValue.validFrom?.trim() ?? '',
      validUntil: rawValue.validUntil?.trim() ?? '',
    };
  }

  private toPreviewOffer(payload: OfferPayload): OfferItem {
    const id = this.loadedOffer?.id ?? this.offerId ?? this.slugify(payload.title);

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

    return slug || `offer-${Date.now()}`;
  }
}
