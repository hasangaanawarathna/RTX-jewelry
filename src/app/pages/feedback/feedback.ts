import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { DEMO_FEEDBACK } from '../../data/demo-store';
import {
  Feedback as FeedbackService,
  FeedbackItem,
  FeedbackPayload,
} from '../../services/feedback';

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

  readonly feedbackItems = signal<FeedbackItem[]>(DEMO_FEEDBACK);
  readonly ratingOptions = [5, 4, 3, 2, 1];
  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);

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

    this.feedbackService.addFeedback(payload).subscribe({
      next: (item) => {
        this.feedbackItems.update((items) => [item, ...items]);
        this.isSubmitting.set(false);
        this.successMessage.set('Thank you for sharing your feedback.');
        this.feedbackForm.reset({ customerName: '', message: '', rating: 5 });
      },
      error: () => {
        this.feedbackItems.update((items) => [
          {
            id: `local-feedback-${Date.now()}`,
            ...payload,
            createdAt: 'Just now',
            status: 'Pending',
          },
          ...items,
        ]);
        this.isSubmitting.set(false);
        this.successMessage.set(
          'Feedback added to the frontend preview. Connect the backend API to store it.'
        );
        this.feedbackForm.reset({ customerName: '', message: '', rating: 5 });
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
