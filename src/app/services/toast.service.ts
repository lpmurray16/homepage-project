import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];
  private nextId = 0;
  private readonly duration = 3000;

  show(message: string, type: ToastType = 'success'): void {
    const id = this.nextId++;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.dismiss(id), this.duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
