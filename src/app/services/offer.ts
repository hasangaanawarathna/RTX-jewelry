import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validFrom: string;
  validUntil: string;
}

export interface OfferPayload {
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
  offer?: unknown;
  item?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Offer {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = `${environment.apiBaseUrl}/offers`;

  getOffers(): Observable<OfferItem[]> {
    return this.http.get<unknown>(this.baseApiUrl).pipe(
      map((response) => this.normalizeOffersResponse(response))
    );
  }

  getOfferById(id: string): Observable<OfferItem | null> {
    return this.http.get<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}`).pipe(
      map((response) => this.normalizeOfferResponse(response))
    );
  }

  createOffer(payload: OfferPayload): Observable<OfferItem> {
    return this.http.post<unknown>(this.baseApiUrl, payload).pipe(
      map((response) => this.normalizeOfferResponse(response) ?? this.toOfferItem(payload))
    );
  }

  updateOffer(id: string, payload: OfferPayload): Observable<OfferItem> {
    return this.http.put<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}`, payload).pipe(
      map((response) => this.normalizeOfferResponse(response) ?? this.toOfferItem({ ...payload, id }))
    );
  }

  deleteOffer(id: string): Observable<void> {
    return this.http.delete<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}`).pipe(
      map(() => undefined)
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

  private normalizeOfferResponse(response: unknown): OfferItem | null {
    if (this.isObject(response)) {
      const typedResponse = response as OffersApiResponse;

      if (this.isObject(typedResponse.offer)) {
        return this.toOfferItem(typedResponse.offer);
      }

      if (this.isObject(typedResponse.item)) {
        return this.toOfferItem(typedResponse.item);
      }

      if (this.isObject(typedResponse.data)) {
        return this.toOfferItem(typedResponse.data);
      }

      return this.toOfferItem(response);
    }

    return null;
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
