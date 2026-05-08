import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type FeedbackStatus = 'Pending' | 'Approved' | 'Rejected';

export interface FeedbackItem {
  id: string;
  customerName: string;
  message: string;
  rating: number;
  createdAt: string;
  status: FeedbackStatus;
}

export interface FeedbackPayload {
  customerName: string;
  message: string;
  rating: number;
}

interface FeedbackApiResponse {
  items?: unknown;
  data?: unknown;
  feedback?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Feedback {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = `${environment.apiBaseUrl}/feedback`;

  getFeedback(): Observable<FeedbackItem[]> {
    return this.http.get<unknown>(this.baseApiUrl).pipe(
      map((response) => this.normalizeFeedbackResponse(response))
    );
  }

  addFeedback(payload: FeedbackPayload): Observable<FeedbackItem> {
    return this.http.post<unknown>(this.baseApiUrl, payload).pipe(
      map((response) => this.normalizeFeedbackItemResponse(response, payload))
    );
  }

  updateFeedbackStatus(id: string, status: FeedbackStatus): Observable<FeedbackItem> {
    return this.http
      .patch<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}/status`, { status })
      .pipe(map((response) => this.normalizeFeedbackItemResponse(response, {
        customerName: 'Customer',
        message: '',
        rating: 5,
      })));
  }

  deleteFeedback(id: string): Observable<void> {
    return this.http.delete<unknown>(`${this.baseApiUrl}/${encodeURIComponent(id)}`).pipe(
      map(() => undefined)
    );
  }

  private normalizeFeedbackResponse(response: unknown): FeedbackItem[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.toFeedbackItem(item));
    }

    if (this.isObject(response)) {
      const typedResponse = response as FeedbackApiResponse;

      if (Array.isArray(typedResponse.items)) {
        return typedResponse.items.map((item) => this.toFeedbackItem(item));
      }

      if (Array.isArray(typedResponse.data)) {
        return typedResponse.data.map((item) => this.toFeedbackItem(item));
      }
    }

    return [];
  }

  private normalizeFeedbackItemResponse(response: unknown, fallback: FeedbackPayload): FeedbackItem {
    if (this.isObject(response)) {
      const typedResponse = response as FeedbackApiResponse;

      if (this.isObject(typedResponse.feedback)) {
        return this.toFeedbackItem(typedResponse.feedback);
      }

      if (this.isObject(typedResponse.data)) {
        return this.toFeedbackItem(typedResponse.data);
      }

      return this.toFeedbackItem(response);
    }

    return {
      id: `feedback-${Date.now()}`,
      customerName: fallback.customerName,
      message: fallback.message,
      rating: fallback.rating,
      createdAt: 'Just now',
      status: 'Pending',
    };
  }

  private toFeedbackItem(item: unknown): FeedbackItem {
    const row = this.isObject(item) ? item : {};
    const customerName =
      this.toText(row['customerName']) ?? this.toText(row['name']) ?? 'Customer';

    return {
      id: this.toText(row['id']) ?? this.toText(row['_id']) ?? `feedback-${this.slugify(customerName)}`,
      customerName,
      message: this.toText(row['message']) ?? this.toText(row['feedback']) ?? '',
      rating: this.toRating(row['rating']),
      createdAt: this.toText(row['createdAt']) ?? this.toText(row['date']) ?? 'Recently',
      status: this.toStatus(row['status']),
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

  private toRating(value: unknown): number {
    const rating = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(rating)) {
      return 5;
    }

    return Math.min(5, Math.max(1, Math.round(rating)));
  }

  private toStatus(value: unknown): FeedbackStatus {
    const status = this.toText(value)?.toLowerCase();

    if (status === 'pending') {
      return 'Pending';
    }

    if (status === 'rejected') {
      return 'Rejected';
    }

    return 'Approved';
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
