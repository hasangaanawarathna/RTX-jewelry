import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class Toast {
  private nextId = 1;

  readonly messages = signal<ToastMessage[]>([]);

  success(text: string): void {
    this.show('success', text);
  }

  error(text: string): void {
    this.show('error', text);
  }

  info(text: string): void {
    this.show('info', text);
  }

  dismiss(id: number): void {
    this.messages.update((items) => items.filter((item) => item.id !== id));
  }

  private show(type: ToastType, text: string): void {
    const id = this.nextId++;
    this.messages.update((items) => [...items, { id, type, text }]);

    window.setTimeout(() => {
      this.dismiss(id);
    }, 5200);
  }
}
