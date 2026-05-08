import { Injectable } from '@angular/core';
import { DEMO_FEEDBACK, DEMO_INQUIRIES, DEMO_OFFERS, DEMO_PRODUCTS } from '../data/demo-store';
import { InquiryItem } from '../services/contact';
import { FeedbackItem, FeedbackStatus } from '../services/feedback';
import { OfferItem } from '../services/offer';
import { ProductItem } from '../services/product';

@Injectable({
  providedIn: 'root',
})
export class AdminPreviewStore {
  private readonly productsKey = 'rtx_preview_products';
  private readonly offersKey = 'rtx_preview_offers';
  private readonly feedbackKey = 'rtx_preview_feedback';
  private readonly inquiriesKey = 'rtx_preview_inquiries';

  getProducts(): ProductItem[] {
    return this.read(this.productsKey, DEMO_PRODUCTS);
  }

  saveProducts(items: ProductItem[]): void {
    this.write(this.productsKey, items);
  }

  upsertProduct(item: ProductItem): ProductItem[] {
    const items = this.getProducts();
    const index = items.findIndex((product) => product.id === item.id);
    const nextItems = index >= 0
      ? items.map((product) => product.id === item.id ? item : product)
      : [item, ...items];

    this.saveProducts(nextItems);
    return nextItems;
  }

  removeProduct(id: string): ProductItem[] {
    const nextItems = this.getProducts().filter((item) => item.id !== id);
    this.saveProducts(nextItems);
    return nextItems;
  }

  getOffers(): OfferItem[] {
    return this.read(this.offersKey, DEMO_OFFERS);
  }

  saveOffers(items: OfferItem[]): void {
    this.write(this.offersKey, items);
  }

  upsertOffer(item: OfferItem): OfferItem[] {
    const items = this.getOffers();
    const index = items.findIndex((offer) => offer.id === item.id);
    const nextItems = index >= 0
      ? items.map((offer) => offer.id === item.id ? item : offer)
      : [item, ...items];

    this.saveOffers(nextItems);
    return nextItems;
  }

  removeOffer(id: string): OfferItem[] {
    const nextItems = this.getOffers().filter((item) => item.id !== id);
    this.saveOffers(nextItems);
    return nextItems;
  }

  getFeedback(): FeedbackItem[] {
    return this.read(this.feedbackKey, DEMO_FEEDBACK);
  }

  saveFeedback(items: FeedbackItem[]): void {
    this.write(this.feedbackKey, items);
  }

  updateFeedbackStatus(id: string, status: FeedbackStatus): FeedbackItem[] {
    const nextItems = this.getFeedback().map((item) =>
      item.id === id ? { ...item, status } : item
    );
    this.saveFeedback(nextItems);
    return nextItems;
  }

  removeFeedback(id: string): FeedbackItem[] {
    const nextItems = this.getFeedback().filter((item) => item.id !== id);
    this.saveFeedback(nextItems);
    return nextItems;
  }

  getInquiries(): InquiryItem[] {
    return this.read(this.inquiriesKey, DEMO_INQUIRIES);
  }

  saveInquiries(items: InquiryItem[]): void {
    this.write(this.inquiriesKey, items);
  }

  updateInquiryStatus(id: string, status: string): InquiryItem[] {
    const nextItems = this.getInquiries().map((item) =>
      item.id === id ? { ...item, status } : item
    );
    this.saveInquiries(nextItems);
    return nextItems;
  }

  private read<T>(key: string, fallback: T): T {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return fallback;
    }
  }

  private write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
