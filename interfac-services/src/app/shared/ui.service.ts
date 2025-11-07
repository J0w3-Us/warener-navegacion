import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private openCreateSub = new Subject<void>();
  openCreate$ = this.openCreateSub.asObservable();

  emitOpenCreate() {
    this.openCreateSub.next();
  }
}
