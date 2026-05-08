import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string | null;
  images: string[];
  availability: string;
}

interface ProductsApiResponse {
  items?: unknown;
  data?: unknown;
  product?: unknown;
  item?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = '/api/products';

  getProducts(): Observable<ProductItem[]> {
    return this.http.get<unknown>(this.baseApiUrl).pipe(
      map((response) => this.normalizeProductsResponse(response))
    );
  }

  getFeaturedProducts(): Observable<ProductItem[]> {
    return this.http.get<unknown>(`${this.baseApiUrl}/featured`).pipe(
      map((response) => this.normalizeProductsResponse(response))
    );
  }

  getProductById(id: string): Observable<ProductItem | null> {
    return this.http.get<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}`).pipe(
      map((response) => this.normalizeProductResponse(response))
    );
  }

  private normalizeProductsResponse(response: unknown): ProductItem[] {
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

  private normalizeProductResponse(response: unknown): ProductItem | null {
    if (this.isObject(response)) {
      const typedResponse = response as ProductsApiResponse;

      if (this.isObject(typedResponse.product)) {
        return this.toProductItem(typedResponse.product);
      }

      if (this.isObject(typedResponse.item)) {
        return this.toProductItem(typedResponse.item);
      }

      if (this.isObject(typedResponse.data)) {
        return this.toProductItem(typedResponse.data);
      }

      return this.toProductItem(response);
    }

    return null;
  }

  private toProductItem(item: unknown): ProductItem {
    const row = this.isObject(item) ? item : {};
    const primaryImage = this.toText(row['imageUrl']) ?? this.toText(row['image']) ?? null;
    const images = this.toTextArray(row['images']).length > 0
      ? this.toTextArray(row['images'])
      : this.toTextArray(row['imageUrls']);
    const id = this.toText(row['id'])
      ?? this.toText(row['_id'])
      ?? this.toText(row['slug'])
      ?? this.slugify(this.toText(row['name']) ?? 'jewelry-item');

    return {
      id,
      name: this.toText(row['name']) ?? 'Unnamed Jewelry',
      category: this.toText(row['category']) ?? 'Jewelry',
      description: this.toText(row['description']) ?? '',
      price: this.toPriceText(row['price']),
      imageUrl: primaryImage,
      images: images.length > 0 ? images : primaryImage ? [primaryImage] : [],
      availability: this.toAvailabilityText(row)
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

  private toTextArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => this.toText(item))
      .filter((item): item is string => item !== null);
  }

  private toPriceText(value: unknown): string {
    if (typeof value === 'number') {
      return `LKR ${new Intl.NumberFormat('en-LK').format(value)}`;
    }

    return this.toText(value) ?? '';
  }

  private toAvailabilityText(row: Record<string, unknown>): string {
    const explicitAvailability =
      this.toText(row['availability']) ?? this.toText(row['stockStatus']);

    if (explicitAvailability) {
      return explicitAvailability;
    }

    if (typeof row['inStock'] === 'boolean') {
      return row['inStock'] ? 'In stock' : 'Out of stock';
    }

    return 'Available for inquiry';
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
