import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface NotificationEvent {
  userId: number;
  type: string;
  data: any;
}

@Injectable()
export class NotificationsService {
  private eventSubject = new Subject<NotificationEvent>();

  get eventStream$() {
    return this.eventSubject.asObservable();
  }

  emitEvent(userId: number, type: string, data: any) {
    this.eventSubject.next({ userId, type, data });
  }
}
