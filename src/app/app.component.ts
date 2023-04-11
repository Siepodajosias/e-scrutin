import { Component, OnInit } from '@angular/core';
import { AuthService } from './modules/shared/service/auth.service';
import { NavigationService } from './modules/shared/service/navigation.service';
import { NotificationService } from './modules/shared/websocket/notification.service';
import { WebSocketAPI } from './modules/shared/websocket/web-socket-api';
import { MessageService } from 'primeng/api';
import { DonneesFiltre } from 'src/app/modules/shared/model/donnees-filtre';

interface SideNavToggle{
	screenwidth:number;
	collapsed:boolean
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isSideNavCollapsed = true;
	screenwidth = 1920;
	webSocketAPI: WebSocketAPI;
	name: string;
	commissionLocales: string[] = [];
	showNotification = false;
	audioContext = new AudioContext();
	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();

	constructor(private authService: AuthService,
				private navigationService: NavigationService,
				private messageService: MessageService,
				private notificationService: NotificationService) {
	}

	ngOnInit(): void {
		if (!this.authService.isAuthenticated()) {
			this.navigationService.goToConnexion();
		}
		this.handleNotification();
		this.webSocketAPI = new WebSocketAPI(this.notificationService);
		this.connecterWebsocket();
	}

	isNotConnexion(): boolean {
		return this.authService.isAuthenticated() && !this.navigationService.isConnexion();
	}

	/**
	 * Traite la réception d'une notification en affichant ou mettant à jour la popup.
	 */
	handleNotification(): void {
		this.notificationService.notificationChange.subscribe((message) => {
			if (!this.showNotification && !this.navigationService.isCarteInteractive()) {
				this.showNotification = true;
			}
			this.commissionLocales.push(message.nom);
		});
	}
	/**
	 * Connecte le websocket.
	 */
	connecterWebsocket(): void {
		this.webSocketAPI.connecterWebsocket();
	}

	/**
	 * Déconnecte le websocket.
	 */
	deconnecterWebsocket(): void {
		this.webSocketAPI.deconnecterWebsocket();
	}

	/**
	 * Permet d'envoyer une notification à partir du websocket.
	 */
	envoyerNotification(): void {
		this.webSocketAPI.envoyerNotification(this.name);
	}

	/**
	 * Ignore la notification et ferme la popup.
	 */
	ignorer(): void {
		this.showNotification = false;
		this.messageService.clear('notification');
	}

	/**
	 * Rafrîchit l'écran.
	 */
	rafraichir(): void {
		window.location.reload();
	}

	/**
	 * Affiche le code de la circonscription à partir du message de la notification.
	 *
	 * @param message le message de la notification.
	 */
	codeCirconscription(message: string): string {
		return message?.split('|').shift();
	}

	/**
	 * Affiche le nom de la commission locale à partir du message de la notification.
	 *
	 * @param message le message de la notification.
	 */
	nomCommissionLocale(message: string): string {
		return message?.split('|').pop();
	}

	/**
	 * Emet un bip sonore.
	 *
	 * @param volume le volume.
	 * @param frequence la fréquence.
	 * @param duree la durée en ms.
	 */
	beep(volume: number, frequence: number, duree: number): void {
		const oscillator = this.audioContext.createOscillator();
		const gain = this.audioContext.createGain();
		oscillator.connect(gain);
		oscillator.frequency.value = frequence;
		oscillator.type = 'square';
		oscillator.connect(this.audioContext.destination);
		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + duree * 0.001);
	}

	onToggleSideNav(data: SideNavToggle):void {
		this.screenwidth=data.screenwidth;
		this.isSideNavCollapsed=data.collapsed;
	}
}
