import { DonneesFiltre } from 'src/app/modules/shared/model/donnees-filtre';
import { NotificationMessage } from "../websocket/notification-message";
import { MessageService } from "primeng/api";

export class NotificationUtils {
	static TITRE_NOTIFICATION = 'Mise à jour des données :';
	static DETAIL_NOTIFICATION = 'Fichier reçu :';

	/**
	 * Retourne true si la notification concerne les données affichées.
	 *
	 * @param notificationMessage la notification.
	 * @param donneeFiltres les filtres appliqués.
	 */
	static canNotifier(notificationMessage: NotificationMessage, donneeFiltres: DonneesFiltre): boolean {
		return donneeFiltres.annee &&
			donneeFiltres.typeScrutin &&
			donneeFiltres.tour &&
			(
				!donneeFiltres.region?.length ||
				(donneeFiltres.region?.indexOf(notificationMessage.region.code) !== -1 &&
					!donneeFiltres.circonscription?.length) ||
				(donneeFiltres.region?.indexOf(notificationMessage.region.code) !== -1 &&
					donneeFiltres.circonscription?.indexOf(notificationMessage.circonscription.code) !== -1 &&
					!donneeFiltres.commissionLocale?.length)
			);
	}

	/**
	 * Affiche une notification de type toast.
	 *
	 * @param messageService- le service de messagerie.
	 * @param type le type de notification.
	 * @param titre le titre de la notification.
	 * @param message le message de la notification.
	 * @param permanent true si la notification doit s'afficher en permanence.
	 */
	static afficherToast(messageService: MessageService, type: string, titre: string, message: string, permanent = false): void {
		messageService.add({
			severity: type,
			sticky: permanent,
			summary: titre,
			detail: message
		});
	}
}
