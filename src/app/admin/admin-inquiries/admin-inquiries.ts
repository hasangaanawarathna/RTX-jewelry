import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AdminPreviewStore } from '../admin-preview-store';
import { getApiErrorMessage } from '../../services/api-error';
import { Contact, InquiryItem } from '../../services/contact';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [],
  templateUrl: './admin-inquiries.html',
  styleUrl: './admin-inquiries.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminInquiries {
  private readonly contactService = inject(Contact);
  private readonly toast = inject(Toast);
  private readonly previewStore = inject(AdminPreviewStore);

  readonly inquiries = signal<InquiryItem[]>([]);
  readonly statuses = ['New', 'Pending', 'Contacted', 'Replied', 'Closed'];
  readonly isLoading = signal(true);
  readonly updatingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadInquiries();
  }

  loadInquiries(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.contactService
      .getInquiries()
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Inquiries could not be loaded.'));
          this.toast.info('Showing saved frontend preview inquiries.');
          return of(this.previewStore.getInquiries());
        })
      )
      .subscribe((items) => {
        this.inquiries.set(items);
        this.previewStore.saveInquiries(items);
        this.isLoading.set(false);
      });
  }

  updateStatus(inquiry: InquiryItem, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const status = select.value;

    if (inquiry.status === status || this.updatingId()) {
      return;
    }

    this.updatingId.set(inquiry.id);
    this.errorMessage.set(null);

    this.contactService.updateInquiryStatus(inquiry.id, status).subscribe({
      next: (updatedInquiry) => {
        this.inquiries.update((items) =>
          items.map((item) => item.id === inquiry.id ? { ...item, ...updatedInquiry, status } : item)
        );
        this.previewStore.updateInquiryStatus(inquiry.id, status);
        this.updatingId.set(null);
        this.toast.success('Inquiry status updated.');
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          const nextItems = this.previewStore.updateInquiryStatus(inquiry.id, status);
          this.inquiries.set(nextItems);
          this.toast.info('Backend unavailable. Inquiry status updated in the frontend preview.');
        } else {
          this.errorMessage.set(getApiErrorMessage(error, 'Inquiry status could not be updated.'));
          this.toast.error(this.errorMessage() ?? 'Inquiry status could not be updated.');
        }

        this.updatingId.set(null);
      },
    });
  }

  isReplied(status: string): boolean {
    const normalizedStatus = status.toLowerCase();
    return normalizedStatus === 'replied' || normalizedStatus === 'closed' || normalizedStatus === 'contacted';
  }
}
