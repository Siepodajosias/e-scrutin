import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {NotificationService} from './notification.service';
import {environment} from "../../../../environments/environment";

export class WebSocketAPI {
	webSocketEndPoint = environment.apiUrl + '/websocket';
	topic = '/topic/notifier-traitement-fichier';
	stompClient: any;

	constructor(private notificationService: NotificationService) {
	}

	/**
	 * Connecte le websocket.
	 */
	connecterWebsocket(): void {
		const ws = new SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);

		this.stompClient.connect({}, () => {
			this.stompClient.subscribe(this.topic, (sdkEvent: any) => {
				this.onMessageReceived(sdkEvent);
			});
		}, this.errorCallBack);
	};

	/**
	 * Déconnecte le websocket.
	 */
	deconnecterWebsocket(): void {
		if (this.stompClient !== null) {
			this.stompClient.disconnect();
		}
	}

	/**
	 * Callback appelé lors de connexion au websocket. Relance la connexion après 5s.
	 *
	 * @param error l'erreur.
	 */
	errorCallBack(error: any): void {
		setTimeout(() => {
			this.connecterWebsocket();
		}, 5000);
	}

	/**
	 * Permet d'envoyer une notification à partir du websocket.
	 *
	 * @param message le message.
	 */
	envoyerNotification(message: any): void {
		this.stompClient.send('/notifier/traitement-fichier', {}, JSON.stringify(message));
	}

	/**
	 * Callback appelé pour diffuser une notification.
	 *
	 * @param notification la notification.
	 */
	onMessageReceived(notification: any): void {
		this.notificationService.diffuserNotification(JSON.parse(notification.body));
	}
}
