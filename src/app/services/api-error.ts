import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const serverMessage = readServerMessage(error.error);

    if (serverMessage) {
      return serverMessage;
    }

    if (error.status === 0) {
      return 'Network connection failed. Please check the backend server and try again.';
    }

    if (error.status === 401) {
      return 'Your admin session has expired. Please login again.';
    }

    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error.status >= 500) {
      return 'Server error. Please try again after a moment.';
    }
  }

  return fallback;
}

function readServerMessage(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (value && typeof value === 'object') {
    const row = value as Record<string, unknown>;
    const message = row['message'] ?? row['error'];

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  return null;
}
