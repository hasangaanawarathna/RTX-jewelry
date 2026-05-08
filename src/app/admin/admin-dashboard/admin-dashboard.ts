import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { Contact, InquiryItem } from '../../services/contact';
import { Feedback as FeedbackService, FeedbackItem } from '../../services/feedback';
import { Offer, OfferItem } from '../../services/offer';
import { Product, ProductItem } from '../../services/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  private readonly productService = inject(Product);
  private readonly offerService = inject(Offer);
  private readonly feedbackService = inject(FeedbackService);
  private readonly contactService = inject(Contact);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly products = signal<ProductItem[]>(this.previewStore.getProducts());
  readonly offers = signal<OfferItem[]>(this.previewStore.getOffers());
  readonly feedbackItems = signal<FeedbackItem[]>(this.previewStore.getFeedback());
  readonly inquiries = signal<InquiryItem[]>(this.previewStore.getInquiries());
  readonly isLoading = signal(true);

  readonly totalProducts = computed(() => this.products().length);
  readonly totalOffers = computed(() => this.offers().length);
  readonly totalFeedback = computed(() => this.feedbackItems().length);
  readonly totalInquiries = computed(() => this.inquiries().length);
  readonly pendingFeedback = computed(
    () => this.feedbackItems().filter((item) => item.status === 'Pending').length
  );
  readonly recentInquiries = computed(() => this.inquiries().slice(0, 4));

  constructor() {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    forkJoin({
      products: this.productService.getProducts().pipe(catchError(() => of(this.previewStore.getProducts()))),
      offers: this.offerService.getOffers().pipe(catchError(() => of(this.previewStore.getOffers()))),
      feedbackItems: this.feedbackService.getFeedback().pipe(catchError(() => of(this.previewStore.getFeedback()))),
      inquiries: this.contactService.getInquiries().pipe(catchError(() => of(this.previewStore.getInquiries()))),
    }).subscribe((result) => {
      this.isLoading.set(false);
      this.products.set(result.products);
      this.offers.set(result.offers);
      this.feedbackItems.set(result.feedbackItems);
      this.inquiries.set(result.inquiries);
      this.previewStore.saveProducts(result.products);
      this.previewStore.saveOffers(result.offers);
      this.previewStore.saveFeedback(result.feedbackItems);
      this.previewStore.saveInquiries(result.inquiries);
    });
  }
}
