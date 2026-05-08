import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { DEMO_FEEDBACK, DEMO_INQUIRIES, DEMO_OFFERS, DEMO_PRODUCTS } from '../../data/demo-store';
import { Contact, InquiryItem } from '../../services/contact';
import { Feedback as FeedbackService, FeedbackItem } from '../../services/feedback';
import { Offer, OfferItem } from '../../services/offer';
import { Product, ProductItem } from '../../services/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  private readonly productService = inject(Product);
  private readonly offerService = inject(Offer);
  private readonly feedbackService = inject(FeedbackService);
  private readonly contactService = inject(Contact);

  readonly products = signal<ProductItem[]>(DEMO_PRODUCTS);
  readonly offers = signal<OfferItem[]>(DEMO_OFFERS);
  readonly feedbackItems = signal<FeedbackItem[]>(DEMO_FEEDBACK);
  readonly inquiries = signal<InquiryItem[]>(DEMO_INQUIRIES);
  readonly isLoading = signal(true);

  readonly totalProducts = computed(() => this.products().length);
  readonly totalOffers = computed(() => this.offers().length);
  readonly totalFeedback = computed(() => this.feedbackItems().length);
  readonly recentInquiries = computed(() => this.inquiries().slice(0, 4));

  constructor() {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    forkJoin({
      products: this.productService.getProducts().pipe(catchError(() => of(DEMO_PRODUCTS))),
      offers: this.offerService.getOffers().pipe(catchError(() => of(DEMO_OFFERS))),
      feedbackItems: this.feedbackService.getFeedback().pipe(catchError(() => of(DEMO_FEEDBACK))),
      inquiries: this.contactService.getInquiries().pipe(catchError(() => of(DEMO_INQUIRIES))),
    }).subscribe((result) => {
      this.isLoading.set(false);
      this.products.set(result.products.length > 0 ? result.products : DEMO_PRODUCTS);
      this.offers.set(result.offers.length > 0 ? result.offers : DEMO_OFFERS);
      this.feedbackItems.set(
        result.feedbackItems.length > 0 ? result.feedbackItems : DEMO_FEEDBACK
      );
      this.inquiries.set(result.inquiries.length > 0 ? result.inquiries : DEMO_INQUIRIES);
    });
  }
}
