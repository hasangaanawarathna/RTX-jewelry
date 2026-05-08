import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { DEMO_FEEDBACK } from '../../data/demo-store';
import { getApiErrorMessage } from '../../services/api-error';
import {
  Feedback as FeedbackService,
  FeedbackItem,
  FeedbackPayload,
} from '../../services/feedback';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {
  private readonly formBuilder = inject(FormBuilder);
  private readonly feedbackService = inject(FeedbackService);
  private readonly toast = inject(Toast);

  readonly feedbackItems = signal<FeedbackItem[]>(DEMO_FEEDBACK);
  readonly ratingOptions = [5, 4, 3, 2, 1];
  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly feedbackForm = this.formBuilder.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  constructor() {
    this.loadFeedback();
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid || this.isSubmitting()) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const payload = this.toFeedbackPayload();
    this.isSubmitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.feedbackService.addFeedback(payload).subscribe({
      next: (item) => {
        this.feedbackItems.update((items) => [item, ...items]);
        this.isSubmitting.set(false);
        this.successMessage.set('Thank you for sharing your feedback.');
        this.toast.success('Feedback submitted successfully.');
        this.feedbackForm.reset({ customerName: '', message: '', rating: 5 });
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.feedbackItems.update((items) => [
            {
              id: `local-feedback-${Date.now()}`,
              ...payload,
              createdAt: 'Just now',
              status: 'Pending',
            },
            ...items,
          ]);
          this.successMessage.set(
            'Feedback added to the frontend preview. Connect the backend API to store it.'
          );
          this.toast.info('Backend unavailable. Feedback added to the frontend preview.');
          this.feedbackForm.reset({ customerName: '', message: '', rating: 5 });
        } else {
          this.errorMessage.set(getApiErrorMessage(error, 'Feedback could not be submitted.'));
          this.toast.error(this.errorMessage() ?? 'Feedback could not be submitted.');
        }

        this.isSubmitting.set(false);
      },
    });
  }

  private loadFeedback(): void {
    this.feedbackService
      .getFeedback()
      .pipe(catchError(() => of(DEMO_FEEDBACK)))
      .subscribe((items) => {
        if (items.length > 0) {
          this.feedbackItems.set(items);
        }
      });
  }

  private toFeedbackPayload(): FeedbackPayload {
    const rawValue = this.feedbackForm.getRawValue();

    return {
      customerName: rawValue.customerName ?? '',
      message: rawValue.message ?? '',
      rating: rawValue.rating ?? 5,
    };
  }
}
