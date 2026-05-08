import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DEMO_FEEDBACK, DEMO_OFFERS, DEMO_PRODUCTS } from '../../data/demo-store';
import { Feedback, FeedbackItem } from '../../services/feedback';
import { Offer, OfferItem } from '../../services/offer';
import { Product, ProductItem } from '../../services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly productService = inject(Product);
  private readonly offerService = inject(Offer);
  private readonly feedbackService = inject(Feedback);

  readonly featuredJewelry = signal<ProductItem[]>(DEMO_PRODUCTS.slice(0, 3));
  readonly specialOffers = signal<OfferItem[]>(DEMO_OFFERS);
  readonly feedbackPreview = signal<FeedbackItem[]>(DEMO_FEEDBACK);

  constructor() {
    this.loadFeaturedJewelry();
    this.loadSpecialOffers();
    this.loadFeedbackPreview();
  }

  private loadFeaturedJewelry(): void {
    this.productService.getFeaturedProducts()
      .pipe(catchError(() => of(DEMO_PRODUCTS.slice(0, 3))))
      .subscribe((items) => {
        if (items.length > 0) {
          this.featuredJewelry.set(items.slice(0, 3));
        }
      });
  }

  private loadSpecialOffers(): void {
    this.offerService.getOffers()
      .pipe(catchError(() => of(DEMO_OFFERS)))
      .subscribe((items) => {
        if (items.length > 0) {
          this.specialOffers.set(items.slice(0, 3));
        }
      });
  }

  private loadFeedbackPreview(): void {
    this.feedbackService.getFeedback()
      .pipe(catchError(() => of(DEMO_FEEDBACK)))
      .subscribe((items) => {
        if (items.length > 0) {
          this.feedbackPreview.set(items.slice(0, 3));
        }
      });
  }
}
