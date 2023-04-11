import { Component } from '@angular/core';
import { DonneesTableauDeBord } from '../../shared/model/tableau-bord.model';
import { DonneesFiltre } from '../../shared/model/donnees-filtre';
import { FiltreService } from '../../shared/service/filtre.service';
import { ResultatService } from '../../shared/service/resultat.service';
import { ChartOptions } from '../../shared/model/chart-participation';
import { NotificationService } from 'src/app/modules/shared/websocket/notification.service';
import { NavigationService } from 'src/app/modules/shared/service/navigation.service';
import { MessageService } from 'primeng/api';
import { NotificationUtils } from 'src/app/modules/shared/utils/notification-utils';
import {NotificationMessage} from "../../shared/websocket/notification-message";

@Component({
	selector: 'app-tableau-de-bord',
	templateUrl: './tableau-de-bord.html',
	styleUrls: ['./tableau-de-bord.scss']
})
export class TableauDeBord {

	private readonly MESSAGE_ERREUR_RECUPERATION_DONNEES = 'Erreur lors de la récupération des données';
	resultatParPartiChartOptions: Partial<ChartOptions>;
	resultatParCandidatChartOptions: Partial<ChartOptions>;
	donneesTableauDeBord: DonneesTableauDeBord;
	nomsCandidats: string[] = [];
	nombreVoixParCandidat: number[] = [];
	couleursParParti: string[] = [];
	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();
	isLoading = false;
	tauxParticipationHomme: number;
	tauxParticipationFemme: number;
	tauxSuffragesExprimes: number;
	tauxBulletinsBlancs: number;
	tauxBulletinNuls: number;

	constructor(private filtreService: FiltreService,
				private resultatService: ResultatService,
				private messageService: MessageService,
				private notificationService: NotificationService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
			this.recupererDonneesTableauDeBord(true);
		}
		this.handleChangementFiltre();
		this.handleNotification();
	}

	/**
	 * Charge les données du tableau de bord au clic du bouton valider.
	 */
	handleChangementFiltre(): void {
		this.filtreService.filtreChange.subscribe({
			next: (donneesFiltre) => {
				this.donneeFiltres = donneesFiltre;
				if (donneesFiltre.typeScrutin && donneesFiltre.annee) {
					this.recupererDonneesTableauDeBord(true);
				}
			}
		});
	}

	/**
	 * Traite la réception d'une notification en affichant ou mettant à jour le tableau de bord.
	 */
	handleNotification(): void {
		this.notificationService.notificationChange.subscribe((message) => {
			const codeCirconscription = message.circonscription.code;
			const codeRegion = message.region.code;
			this.verifierEtNotifier(message);
		});
	}

	/**
	 * Affiche la notification si elle concerne les données affichées.
	 *
	 * @param notificationMessage la notification.
	 * @private
	 */
	private verifierEtNotifier(notificationMessage: NotificationMessage): void {
		if (this.navigationService.isTableauDeBord() &&
				NotificationUtils.canNotifier(notificationMessage, this.donneeFiltres)) {
			this.afficherNotification(notificationMessage.commissionLocale.designation);
			this.recupererDonneesTableauDeBord(false);
		}
	}

	/**
	 * Affiche le message de notification.
	 *x
	 * @param designationCommissionLocale désignation de la commission locale à notifier.
	 */
	private afficherNotification(designationCommissionLocale: string): void {
		this.messageService.clear();
		this.messageService.add({
			key: 'notification',
			severity: 'success',
			summary: NotificationUtils.TITRE_NOTIFICATION,
			detail: NotificationUtils.DETAIL_NOTIFICATION + designationCommissionLocale,
			icon: 'pi-file'
		});
	}

	/**
	 * Récupère les données du tableau de bord
	 */
	recupererDonneesTableauDeBord(isNotification = true): void {
		this.isLoading = isNotification;
		this.resultatService.recupererListeResultatPourTableauDeBord(this.donneeFiltres).subscribe({
			next: (data) => {
				this.construireLesDonneesDuTableauDeBord(data);
			},
			error: () => {
				this.messageService.add({
					key: 'notification',
					sticky: true,
					severity: 'error',
					summary: 'Erreur',
					detail: this.MESSAGE_ERREUR_RECUPERATION_DONNEES,
					icon: 'pi-file'
				});
				this.isLoading = false;
			},
			complete: () => {
				this.isLoading = false;
			}
		});
	}

	/**
	 * Construit les données du tableau de bord.
	 *
	 * @param donneesTableauDeBord les données du tableau de bord.
	 * @private
	 */
	private construireLesDonneesDuTableauDeBord(donneesTableauDeBord: DonneesTableauDeBord): void {
		this.donneesTableauDeBord = donneesTableauDeBord;
		this.nombreVoixParCandidat = [];
		this.nomsCandidats = [];
		this.couleursParParti = [];

		if (this.donneesTableauDeBord.nombreFemmes || this.donneesTableauDeBord.nombreHommes) {
			const total = this.donneesTableauDeBord.nombreFemmes + this.donneesTableauDeBord.nombreHommes;
			this.tauxParticipationFemme = (this.donneesTableauDeBord.nombreFemmes / total) * 100;
			this.tauxParticipationHomme = (this.donneesTableauDeBord.nombreHommes / total) * 100;
		}

		if (this.donneesTableauDeBord.totalVotants && this.donneesTableauDeBord.totalVotants) {
			this.tauxBulletinNuls = (this.donneesTableauDeBord.nombreBulletinsNuls / this.donneesTableauDeBord.totalVotants) * 100;
			this.tauxSuffragesExprimes = (this.donneesTableauDeBord.suffragesExprimes / this.donneesTableauDeBord.totalVotants) * 100;
		}

		if (this.donneesTableauDeBord.suffragesExprimes) {
			this.tauxBulletinsBlancs = (this.donneesTableauDeBord.nombreBulletinsBlancs / this.donneesTableauDeBord.suffragesExprimes) * 100;
		}

		this.donneesTableauDeBord.voixPartis.sort();
		for (const element of this.donneesTableauDeBord.voixPartis) {
			this.nombreVoixParCandidat.push(element.nombre);
			this.nomsCandidats.push(element.nom);
			this.couleursParParti.push(element.codeCouleur);
		}

		if (!this.donneesTableauDeBord.multipleCircnscription) {
			this.construireDiagrammeResultats();
		} else {
			this.construireDiagrammePartiPolitique();
		}
	}

	/**
	 * Construit le diagramme circulaire des résultats par parti politique.
	 */
	private construireDiagrammePartiPolitique(): void {
		this.resultatParPartiChartOptions = {
			serie: this.nombreVoixParCandidat,
			chart: {
				width: '70%',
				type: 'pie'
			},
			labels: this.nomsCandidats,
			colors: this.couleursParParti,
			title: {
				text: 'Nombre de scrutins remportés par parti politique'
			},
			dataLabels: {
				enabled: true,
				formatter(val, opts) {
					return opts.w.config.labels[opts.seriesIndex] + ' ' +
							(Math.round(Number(val) * 100) / 100).toFixed(2) + '%';
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}
			]
		};
	}

	/**
	 * Construit l'histogramme des résultats par candidat.
	 */
	private construireDiagrammeResultats(): void {
		this.resultatParCandidatChartOptions = {
			series: [
				{
					name: 'Nombre de voix',
					data: this.nombreVoixParCandidat,
				}
			],
			chart: {
				type: 'bar',
				height: 350,
				stacked: false,
				toolbar: {
					show: false,
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						legend: {
							position: 'bottom',
							offsetX: -10,
							offsetY: 0,
						},
					},
				},
			],
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '30%',
					distributed: true
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				type: 'category',
				categories: this.nomsCandidats,
				labels: {
					rotate: -45,
					style: {
						fontSize: '9px',
					}
				}
			},
			legend: {
				show: false,
			},
			tooltip: {
				theme: 'dark',
				marker: {
					show: true,
				},
				x: {
					show: true,
				},
			},
			title: {
				text: 'Nombre de voix par candidat'
			}
		};
	}
}
