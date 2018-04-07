import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

export class Notification {
  type: string;
  label: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  static message: Subject<Notification> = new Subject<Notification>();

  constructor() {}

  private types = [
    'success',
    'danger',
    'info',
    'warning',
    'primary',
    'secondary',
    'light',
    'dark'
  ];

  public show(type: string, label: string, message: string): void {
    if (!this.checkType(type)) return;

    NotificationsService.message.next({ type, label, message });
  }

  private checkType(type: string): boolean {
    return this.types.some(elem => elem === type);
  }

}
