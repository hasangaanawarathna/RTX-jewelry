import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { getApiErrorMessage } from '../../services/api-error';
import { Offer, OfferItem } from '../../services/offer';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-offers.html',
  styleUrl: './admin-offers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOffers {
  private readonly offerService = inject(Offer);
  private readonly toast = inject(Toast);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly offers = signal<OfferItem[]>([]);
  readonly isLoading = signal(true);
  readonly deletingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.offerService
      .getOffers()
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Offers could not be loaded.'));
          this.toast.info('Showing saved frontend preview offers.');
          return of(this.previewStore.getOffers());
        })
      )
      .subscribe((items) => {
        this.offers.set(items);
        this.previewStore.saveOffers(items);
        this.isLoading.set(false);
      });
  }

  deleteOffer(offer: OfferItem): void {
    const confirmed = window.confirm(`Delete offer "${offer.title}"?`);

    if (!confirmed || this.deletingId()) {
      return;
    }

    this.deletingId.set(offer.id);
    this.errorMessage.set(null);

    this.offerService.deleteOffer(offer.id).subscribe({
      next: () => {
        this.offers.update((items) => items.filter((item) => item.id !== offer.id));
        this.previewStore.removeOffer(offer.id);
        this.deletingId.set(null);
        this.toast.success('Offer deleted successfully.');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          const nextItems = this.previewStore.removeOffer(offer.id);
          this.offers.set(nextItems);
          this.toast.info('Backend unavailable. Offer removed from the frontend preview.');
        } else {
          this.errorMessage.set(getApiErrorMessage(error, 'Offer could not be deleted.'));
          this.toast.error(this.errorMessage() ?? 'Offer could not be deleted.');
        }

        this.deletingId.set(null);
      },
    });
  }
}
