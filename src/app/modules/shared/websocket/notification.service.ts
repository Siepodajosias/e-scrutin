import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {NotificationMessage} from './notification-message';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	notificationChange: Subject<NotificationMessage> = new Subject<NotificationMessage>();

	constructor() {
	}

	/**
	 * Diffuse une notification.
	 *
	 * @param notificationMessage la notification.
	 */
	diffuserNotification(notificationMessage: NotificationMessage): void {
		this.notificationChange.next(notificationMessage);
	}
}
