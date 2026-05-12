import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InquiryPayload {
  customerName: string;
  phone: string;
  email: string;
  message: string;
  productId: string;
  productName: string;
}

export interface InquiryItem extends InquiryPayload {
  id: string;
  status: string;
  createdAt: string;
}

interface InquiryApiResponse {
  items?: unknown;
  data?: unknown;
  inquiry?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Contact {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = `${environment.apiBaseUrl}/inquiries`;

  sendInquiry(payload: InquiryPayload): Observable<InquiryItem> {
    return this.http.post<unknown>(this.baseApiUrl, payload).pipe(
      map((response) => this.normalizeInquiryItemResponse(response, payload))
    );
  }

  getInquiries(): Observable<InquiryItem[]> {
    return this.http.get<unknown>(this.baseApiUrl).pipe(
      map((response) => this.normalizeInquiriesResponse(response))
    );
  }

  updateInquiryStatus(id: string, status: string): Observable<InquiryItem> {
    return this.http
      .patch<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}/status`, { status })
      .pipe(map((response) => this.normalizeInquiryItemResponse(response, {
        customerName: 'Customer',
        phone: '',
        email: '',
        message: '',
        productId: '',
        productName: 'General inquiry',
      })));
  }

  deleteInquiry(id: string): Observable<void> {
    return this.http.delete<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}`).pipe(
      map(() => undefined)
    );
  }

  private normalizeInquiriesResponse(response: unknown): InquiryItem[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.toInquiryItem(item));
    }

    if (this.isObject(response)) {
      const typedResponse = response as InquiryApiResponse;

      if (Array.isArray(typedResponse.items)) {
        return typedResponse.items.map((item) => this.toInquiryItem(item));
      }

      if (Array.isArray(typedResponse.data)) {
        return typedResponse.data.map((item) => this.toInquiryItem(item));
      }
    }

    return [];
  }

  private normalizeInquiryItemResponse(response: unknown, fallback: InquiryPayload): InquiryItem {
    if (this.isObject(response)) {
      const typedResponse = response as InquiryApiResponse;

      if (this.isObject(typedResponse.inquiry)) {
        return this.toInquiryItem(typedResponse.inquiry);
      }

      if (this.isObject(typedResponse.data)) {
        return this.toInquiryItem(typedResponse.data);
      }

      return this.toInquiryItem(response);
    }

    return {
      ...fallback,
      id: `inquiry-${Date.now()}`,
      status: 'New',
      createdAt: 'Just now',
    };
  }

  private toInquiryItem(item: unknown): InquiryItem {
    const row = this.isObject(item) ? item : {};
    const customerName =
      this.toText(row['customerName']) ?? this.toText(row['name']) ?? 'Customer';

    return {
      id: this.toText(row['id']) ?? this.toText(row['_id']) ?? `inquiry-${Date.now()}`,
      customerName,
      phone: this.toText(row['phone']) ?? '',
      email: this.toText(row['email']) ?? '',
      productId: this.toText(row['productId']) ?? '',
      productName: this.toText(row['productName']) ?? this.toText(row['product']) ?? 'General inquiry',
      message: this.toText(row['message']) ?? '',
      status: this.toText(row['status']) ?? 'New',
      createdAt: this.toText(row['createdAt']) ?? this.toText(row['date']) ?? 'Recently',
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
