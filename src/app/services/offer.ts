import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validFrom: string;
  validUntil: string;
}

interface OffersApiResponse {
  items?: unknown;
  data?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Offer {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = '/api/offers';

  getOffers(): Observable<OfferItem[]> {
    return this.http.get<unknown>(this.baseApiUrl).pipe(
      map((response) => this.normalizeOffersResponse(response))
    );
  }

  private normalizeOffersResponse(response: unknown): OfferItem[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.toOfferItem(item));
    }

    if (this.isObject(response)) {
      const typedResponse = response as OffersApiResponse;

      if (Array.isArray(typedResponse.items)) {
        return typedResponse.items.map((item) => this.toOfferItem(item));
      }

      if (Array.isArray(typedResponse.data)) {
        return typedResponse.data.map((item) => this.toOfferItem(item));
      }
    }

    return [];
  }

  private toOfferItem(item: unknown): OfferItem {
    const row = this.isObject(item) ? item : {};
    const title = this.toText(row['title']) ?? 'Jewelry Offer';

    return {
      id: this.toText(row['id']) ?? this.toText(row['_id']) ?? this.slugify(title),
      title,
      description:
        this.toText(row['description']) ?? this.toText(row['summary']) ?? 'Special jewelry discount.',
      discount:
        this.toText(row['discount']) ?? this.toText(row['discountPercentage']) ?? 'Special saving',
      code: this.toText(row['code']) ?? this.toText(row['offerCode']) ?? 'VISITSHOP',
      validFrom: this.toText(row['validFrom']) ?? this.toText(row['startDate']) ?? 'Available now',
      validUntil: this.toText(row['validUntil']) ?? this.toText(row['expiryDate']) ?? 'While stocks last',
    };
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
  }

  private toText(value: unknown): string | null {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return null;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
