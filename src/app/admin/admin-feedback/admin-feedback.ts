import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { getApiErrorMessage } from '../../services/api-error';
import {
  Feedback as FeedbackService,
  FeedbackItem,
  FeedbackStatus,
} from '../../services/feedback';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [],
  templateUrl: './admin-feedback.html',
  styleUrl: './admin-feedback.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFeedback {
  private readonly feedbackService = inject(FeedbackService);
  private readonly toast = inject(Toast);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly feedbackItems = signal<FeedbackItem[]>([]);
  readonly isLoading = signal(true);
  readonly activeId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.feedbackService
      .getFeedback()
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Feedback could not be loaded.'));
          this.toast.info('Showing saved frontend preview feedback.');
          return of(this.previewStore.getFeedback());
        })
      )
      .subscribe((items) => {
        this.feedbackItems.set(items);
        this.previewStore.saveFeedback(items);
        this.isLoading.set(false);
      });
  }

  updateStatus(item: FeedbackItem, status: FeedbackStatus): void {
    if (item.status === status || this.activeId()) {
      return;
    }

    this.activeId.set(item.id);
    this.errorMessage.set(null);

    this.feedbackService.updateFeedbackStatus(item.id, status).subscribe({
      next: (updatedItem) => {
        this.feedbackItems.update((items) =>
          items.map((feedback) => feedback.id === item.id ? { ...feedback, ...updatedItem, status } : feedback)
        );
        this.previewStore.updateFeedbackStatus(item.id, status);
        this.activeId.set(null);
        this.toast.success(`Feedback marked as ${status.toLowerCase()}.`);
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          const nextItems = this.previewStore.updateFeedbackStatus(item.id, status);
          this.feedbackItems.set(nextItems);
          this.toast.info('Backend unavailable. Feedback status updated in the frontend preview.');
        } else {
          this.errorMessage.set(getApiErrorMessage(error, 'Feedback status could not be updated.'));
          this.toast.error(this.errorMessage() ?? 'Feedback status could not be updated.');
        }

        this.activeId.set(null);
      },
    });
  }

  deleteFeedback(item: FeedbackItem): void {
    const confirmed = window.confirm(`Delete feedback from ${item.customerName}?`);

    if (!confirmed || this.activeId()) {
      return;
    }

    this.activeId.set(item.id);
    this.errorMessage.set(null);

    this.feedbackService.deleteFeedback(item.id).subscribe({
      next: () => {
        this.feedbackItems.update((items) => items.filter((feedback) => feedback.id !== item.id));
        this.previewStore.removeFeedback(item.id);
        this.activeId.set(null);
        this.toast.success('Feedback deleted successfully.');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          const nextItems = this.previewStore.removeFeedback(item.id);
          this.feedbackItems.set(nextItems);
          this.toast.info('Backend unavailable. Feedback deleted from the frontend preview.');
        } else {
          this.errorMessage.set(getApiErrorMessage(error, 'Feedback could not be deleted.'));
          this.toast.error(this.errorMessage() ?? 'Feedback could not be deleted.');
        }

        this.activeId.set(null);
      },
    });
  }
}
