import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
  timeout?: number;
  closing?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages$ = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this._messages$.asObservable();
  private seq = 1;

  private push(msg: Omit<ToastMessage, 'id'>) {
    const t: ToastMessage = { id: this.seq++, ...msg };
    const list = this._messages$.getValue();
    this._messages$.next([...list, t]);
    if (t.timeout && t.timeout > 0) {
      // Start close sequence (set closing flag) so CSS animation can run,
      // then remove after animation finishes.
      setTimeout(() => this.startClose(t.id), t.timeout);
    }
    return t.id;
  }

  private startClose(id: number, animationMs = 300) {
    const list = this._messages$.getValue();
    const updated = list.map(m => (m.id === id ? { ...m, closing: true } : m));
    this._messages$.next(updated);
    setTimeout(() => this.remove(id), animationMs);
  }

  // Public helper to gracefully close a toast (plays animation then removes)
  close(id: number) {
    this.startClose(id);
  }

  success(message: string, title?: string, timeout = 4000) {
    return this.push({ type: 'success', title, message, timeout });
  }

  error(message: string, title?: string, timeout = 4000) {
    return this.push({ type: 'error', title, message, timeout });
  }

  info(message: string, title?: string, timeout = 4000) {
    return this.push({ type: 'info', title, message, timeout });
  }

  remove(id: number) {
    const list = this._messages$.getValue().filter(m => m.id !== id);
    this._messages$.next(list);
  }

  clear() {
    this._messages$.next([]);
  }
}
