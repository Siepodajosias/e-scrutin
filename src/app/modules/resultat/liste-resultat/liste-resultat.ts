import { Component, ViewChild } from '@angular/core';
import { ResultatCandidat } from '../../shared/model/resultat-candidat';
import { LigneResultat } from '../../shared/model/ligne-resultat';
import { FiltreService } from '../../shared/service/filtre.service';
import { ResultatService } from '../../shared/service/resultat.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DonneesFiltre } from '../../shared/model/donnees-filtre';
import { Table } from 'primeng/table';
import { TableauResultat } from 'src/app/modules/shared/model/tableau-resultat';
import { ExportResultat } from 'src/app/modules/shared/model/export-resultat';
import { NotificationService } from 'src/app/modules/shared/websocket/notification.service';
import { NavigationService } from 'src/app/modules/shared/service/navigation.service';

@Component({
	selector: 'app-liste-resultat',
	templateUrl: './liste-resultat.html',
	styleUrls: ['./liste-resultat.scss']
})
export class ListeResultat {
	loading = false;
	tableauResultat: TableauResultat;
	exportResultats: ExportResultat[] = [];
	resultat: LigneResultat;
	modalResultatVisible = false;
	meilleurCandidatCirconscription: ResultatCandidat;
	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();
	rowGroupMetadata: any[];
	expandedRowKeys: string[] = [];
	@ViewChild('listeResultatTable') table: Table;

	constructor(private primeNgConfig: PrimeNGConfig,
				private resultatService: ResultatService,
				private filtreService: FiltreService,
				private messageService: MessageService,
				private notificationService: NotificationService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
			this.recupererResultat(true);
		}
		this.handleChangementFiltreResultat();
		this.updateRowGroupMetadata();
		this.handleNotification();
	}

	/**
	 * Récupère la liste des resultats au click du bouton valider
	 */
	private handleChangementFiltreResultat(): void {
		this.filtreService.filtreChange.subscribe({
			next: (donneesFiltre) => {
				this.donneeFiltres = donneesFiltre;
				if (this.navigationService.isResultat() && this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
					this.recupererResultat(true);
				}
			}
		});
	}

	/**
	 * Traite la réception d'une notification en affichant ou mettant à jour le tableau des résultats globals.
	 */
	handleNotification(): void {
		this.notificationService.notificationChange.subscribe((message) => {
			const codeCirconscription = message.circonscription.code;
			const codeRegion = message.region.code;
			if (this.navigationService.isResultat() &&
					(this.donneeFiltres.circonscription?.indexOf(codeCirconscription) != -1 ||
					this.donneeFiltres.region?.indexOf(codeRegion) != -1) &&
					!this.donneeFiltres.commissionLocale) {
				this.messageService.clear();
				this.messageService.add({
					key: 'notification',
					severity: 'success',
					summary: 'Mise à jour des données',
					detail:'Fichier reçu: '+ message.commissionLocale.designation,
					icon: 'pi-file'
				});
				this.recupererResultat(false);
			}
		});
	}

	/**
	 * Récupère la liste des resultats
	 */
	public recupererResultat(isNotification = true): void {
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin?.length) {
			this.loading = isNotification;
			this.resultatService.recupererListeResultat1(this.donneeFiltres).subscribe({
				next: (resultats) => {
					this.tableauResultat = resultats;
					this.meilleurCandidatCirconscription = this.tableauResultat?.meilleurCandidat ? this.tableauResultat.meilleurCandidat : null;
					this.tableauResultat.resultats.forEach((element) => {
						const exportResultat: ExportResultat[] = [];
						element.resultatCandidats.forEach((element1) => {
							const exportResultat1 = new ExportResultat();
							exportResultat1.circonscription = element.circonscription.designation;
							exportResultat1.partiPolitique = element1.partiPolitique;
							exportResultat1.candidat = element1.candidat;
							exportResultat1.nombreVoix = element1.score;
							exportResultat1.pourcentage = element1.pourcentage + '%';
							exportResultat.push(exportResultat1);
						});
						this.exportResultats.push(...exportResultat);
						// @ts-ignore
						if (element.commissionLocale || element.commissionLocale === 'null') {
							// @ts-ignore
							this.expandedRowKeys[element.commissionLocale.code] = true;
						}
					});
				},
				complete: () => {
					this.loading = false;
				}
			});
		}
	}

	/**
	 * Ouvre la modal du détail des résultats et lui donne le résultat sélectionnée
	 */
	public ouvrirModalDetailResultat(resultat?: LigneResultat): void {
		this.modalResultatVisible = !this.modalResultatVisible;
		this.resultat = resultat;
	}

	/**
	 * Retourne le canditat qui a le meilleur score.
	 * @param resultatCandidats la liste des résultats des candidats.
	 */
	public meilleurCandidat(resultatCandidats: ResultatCandidat[]): ResultatCandidat {
		if (resultatCandidats?.length) {
			resultatCandidats.sort((resultatCandidat1, resultatCandidat2) => resultatCandidat2.score - resultatCandidat1.score);
			return resultatCandidats[0];
		}
		return null;
	}

	/**
	 * Coloration des vainqueurs par leurs couleurs de partis
	 * @param resultatCandidat
	 * @param listeResultatCandidat
	 * @returns
	 */
	public couleurCandidat(resultatCandidat: ResultatCandidat, listeResultatCandidat: ResultatCandidat[]) {
		if (resultatCandidat == this.meilleurCandidat(listeResultatCandidat)) {
			return 'background:' + resultatCandidat.codeCouleur;
		} else {
			return 'background:';
		}
	}

	/**
	 * Ferme la modal du détail résultat
	 */
	public visibleChange(event: boolean): void {
		this.modalResultatVisible = event;
	}

	updateRowGroupMetadata() {
		const data = this.table?.filteredValue ? this.table?.filteredValue : this.tableauResultat?.resultats;
		this.rowGroupMetadata = [];
		if (data) {
			for (let i = 0; i < data.length; i++) {
				const rowData = data[i];
				const codeCommissionLocale = rowData.commissionLocale.code;
				if (i === 0) {
					this.rowGroupMetadata[codeCommissionLocale] = { index: 0, size: 1 };
				} else {
					const previousRowData = data[i - 1];
					const previousRowGroup = previousRowData.commissionLocale.code;
					if (codeCommissionLocale === previousRowGroup) {
						this.rowGroupMetadata[codeCommissionLocale].size++;
					} else {
						this.rowGroupMetadata[codeCommissionLocale] = { index: i, size: 1 };
					}
				}
			}
		}
	}

	/**
	 * Exporter les données au format Excel
	 */
	public exportExcel(): void {
		import('xlsx').then(xlsx => {
			let Heading = [['Circonscription', 'Parti politique', 'Candidat / Liste Candidatures', 'Nombre de voix obtenus', 'Pourcentage']];
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet([]);
			xlsx.utils.sheet_add_aoa(ws, Heading);
			xlsx.utils.sheet_add_json(ws, this.exportResultats, { origin: 'A2', skipHeader: true });
			xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
			xlsx.writeFile(wb, 'rapport-resultat.xlsx');
		});
	}

	/**
	 * Exporter les données au format Csv
	 */
	public exportCSV(): void {
		import('xlsx').then(xlsx => {
			let HeadingCSV = [['Circonscription', 'Parti politique', 'Candidat / Liste Candidatures', 'Nombre de voix obtenus', 'Pourcentage']];
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet([]);
			xlsx.utils.sheet_add_aoa(ws, HeadingCSV);
			xlsx.utils.sheet_add_json(ws, this.exportResultats, { origin: 'A2', skipHeader: true });
			xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
			xlsx.writeFile(wb, 'rapport-resultat.csv');
		});
	}
}
