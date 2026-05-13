import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<Toast | null>(null);

  show(message: string, type: ToastType = 'success') {
    this.toast.set({ message, type });

    setTimeout(() => {
      this.toast.set(null);
    }, 2500);
  }
}