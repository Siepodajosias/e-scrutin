import { Component } from '@angular/core';
import { DonneesFiltre } from '../../shared/model/donnees-filtre';
import { ParticipationService } from '../../shared/service/participation.service';
import { FiltreService } from '../../shared/service/filtre.service';
import { Participations } from '../../shared/model/participations';
import { ExportParticipation } from 'src/app/modules/shared/model/export-participation';
import { NotificationService } from 'src/app/modules/shared/websocket/notification.service';
import { NavigationService } from 'src/app/modules/shared/service/navigation.service';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-liste-participation',
	templateUrl: './liste-participation.html',
	styleUrls: ['./liste-participation.scss']
})

export class ListeParticipation {
	loading = false;
	participations: Participations[] = [];
	exportParticipation: ExportParticipation[] = [];
	participation: Participations = null;
	statutOptions: any[];
	modalParticipationVisible = false;
	typeScrutin: string;
	rowGroupMetadata: any;

	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();

	constructor(private participationService: ParticipationService,
				private filtreService: FiltreService,
				private messageService: MessageService,
				private notificationService: NotificationService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.statutOptions = [
			{ label: 'Pas de filtre', value: '' },
			{ label: 'Réçu', value: true },
			{ label: 'Non réçu', value: false }
		];
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
			this.recupererParticipation(true);
		}
		this.handleChangementFiltreParticipation();
		this.handleNotification();
	}

	/**
	 * Récupère la liste des participations  en fonction des parametres au click du bouton valider
	 */
	private handleChangementFiltreParticipation(): void {
		this.filtreService.filtreChange.subscribe({
			next: (donneesFiltre) => {
				this.donneeFiltres = donneesFiltre;
				if (this.navigationService.isParticipation() && this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
					this.recupererParticipation(true);
				}
			}
		});
	}

	/**
	 * Traite la réception d'une notification en affichant ou mettant à jour le tableau des participations.
	 */
	handleNotification(): void {
		this.notificationService.notificationChange.subscribe((message) => {
			const codeCirconscription = message.circonscription.code;
			const codeRegion = message.region.code;
			if (this.navigationService.isParticipation() &&
					(this.donneeFiltres.circonscription?.indexOf(codeCirconscription) != -1 ||
							this.donneeFiltres.region?.indexOf(codeRegion) != -1) &&
					!this.donneeFiltres.commissionLocale) {
				this.messageService.clear();
				this.messageService.add({
					key: 'notification',
					severity: 'success',
					summary: 'Mise à jour des données :',
					detail: 'Fichier reçu: ' + message.commissionLocale.designation,
					icon: 'pi-file'
				});
				this.recupererParticipation(false);
			}
		});
	}

	/**
	 * Récupère la liste des participations  en fonction des parametres
	 */
	public recupererParticipation(isNotification = true): void {
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
			this.loading = isNotification;
			this.participationService.recupererParticipationLieuVoteScrutin(this.donneeFiltres).subscribe({
				next: (participations) => {
					this.participations = participations.sort();
					this.participations.forEach((element) => {
						const exportParticipation = new ExportParticipation();
						exportParticipation.circonscription = element.circonscription.designation;
						exportParticipation.lieuBureauVote = element.lieuVote.designation + '/' + element.bureauVote.designation;
						exportParticipation.nombreInscrits = element.nombreInscrits;
						exportParticipation.totalParticipants = element.totalParticipants;
						exportParticipation.tauxParticipation = element.tauxParticipation + '%';
						this.exportParticipation.push(exportParticipation);
					});
					this.exportParticipation.sort((p1, p2) => {
						return p1.circonscription.localeCompare(p2.circonscription) ||
								p1.lieuBureauVote.localeCompare(p2.lieuBureauVote);
					});
				},
				complete: () => {
					this.loading = false;
				}
			});
		}
	}

	/**
	 * Ouvre la modal du détail participation et lui donne la participation sélectionnée
	 */
	public ouvrirModalDetailParticipation(participation?: Participations): void {
		this.modalParticipationVisible = !this.modalParticipationVisible;
		this.participation = participation;
	}

	/**
	 * Ferme la modal du détail participation
	 */
	public visibleChange(event: boolean): void {
		this.modalParticipationVisible = event;
	}

	/**
	 * Exporter les données au format Excel
	 */
	public exportExcel(): void {
		import('xlsx').then(xlsx => {
			let Heading = [['Circonscription', 'Lieu de vote - Bureau de vote', 'Nombre d\'inscrits', 'Total de participation', 'Taux de participation']];
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet([]);
			xlsx.utils.sheet_add_aoa(ws, Heading);
			xlsx.utils.sheet_add_json(ws, this.exportParticipation, { origin: 'A2', skipHeader: true });
			xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
			xlsx.writeFile(wb, 'rapport-participation.xlsx');
		});
	}

	/**
	 * Exporter les données au format Csv
	 */
	public exportCSV(): void {
		import('xlsx').then(xlsx => {
			let HeadingCSV = [['Circonscription', 'Lieu de vote - Bureau de vote', 'Nombre d\'inscrits', 'Total de participation', 'Taux de participation']];
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet([]);
			xlsx.utils.sheet_add_aoa(ws, HeadingCSV);
			xlsx.utils.sheet_add_json(ws, this.exportParticipation, { origin: 'A2', skipHeader: true });
			xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
			xlsx.writeFile(wb, 'rapport-participation.csv');
		});
	}
}
