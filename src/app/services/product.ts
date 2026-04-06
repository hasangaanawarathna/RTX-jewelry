import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ProductItem {
  id?: string | number;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string | null;
}

interface ProductsApiResponse {
  items?: unknown;
  data?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = '/api/products';

  getFeaturedProducts(): Observable<ProductItem[]> {
    return this.http.get<unknown>(`${this.baseApiUrl}/featured`).pipe(
      map((response) => this.normalizeFeaturedResponse(response))
    );
  }

  private normalizeFeaturedResponse(response: unknown): ProductItem[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.toProductItem(item));
    }

    if (this.isObject(response)) {
      const typedResponse = response as ProductsApiResponse;
      if (Array.isArray(typedResponse.items)) {
        return typedResponse.items.map((item) => this.toProductItem(item));
      }

      if (Array.isArray(typedResponse.data)) {
        return typedResponse.data.map((item) => this.toProductItem(item));
      }
    }

    return [];
  }

  private toProductItem(item: unknown): ProductItem {
    const row = this.isObject(item) ? item : {};
    return {
      id: this.toText(row['id']) ?? this.toText(row['_id']) ?? undefined,
      name: this.toText(row['name']) ?? 'Unnamed Jewelry',
      category: this.toText(row['category']) ?? 'Jewelry',
      description: this.toText(row['description']) ?? '',
      price: this.toText(row['price']) ?? '',
      imageUrl: this.toText(row['imageUrl']) ?? this.toText(row['image']) ?? null
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
}
