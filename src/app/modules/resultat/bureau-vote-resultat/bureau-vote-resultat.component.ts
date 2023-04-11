import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultatService } from 'src/app/modules/shared/service/resultat.service';
import { DonneesFiltre } from 'src/app/modules/shared/model/donnees-filtre';
import { DetailResultat } from 'src/app/modules/shared/model/detail-resultat';
import { FiltreService } from 'src/app/modules/shared/service/filtre.service';
import { TotalResultat } from 'src/app/modules/shared/model/totalResultat';
import { ResultatCandidat } from 'src/app/modules/shared/model/resultat-candidat';
import { Table } from 'primeng/table';
import { ExportResultatBureauVote } from 'src/app/modules/shared/model/export-resultat-bureau-vote';
import { NotificationService } from 'src/app/modules/shared/websocket/notification.service';
import { NavigationService } from 'src/app/modules/shared/service/navigation.service';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-bureau-vote-resultat',
	templateUrl: './bureau-vote-resultat.component.html',
	styleUrls: ['./bureau-vote-resultat.component.scss']
})

export class BureauVoteResultatComponent implements OnInit {
	commissionLocale: string;
	resultats: DetailResultat[];
	exportResultatsBureauVote: ExportResultatBureauVote[] = [];
	listeCandidats: ResultatCandidat[];
	total: TotalResultat;
	tailleTableau = 11;
	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();
	loading = false;
	@ViewChild('dt') dt: Table | undefined | any;

	constructor(private resultatService: ResultatService,
				private filtreService: FiltreService,
				private messageService: MessageService,
				private notificationService: NotificationService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
			this.recupererResultatBureauVote(true);
		}
		this.handleChangementFiltreResultat();
		this.handleNotification();
	}

	/**
	 * Récupère la liste des résultats des bureaux de votes d'une circonscripion au click du bouton valider
	 * @private
	 */
	private handleChangementFiltreResultat(): void {
		this.filtreService.filtreChange.subscribe({
			next: (donneesFiltre) => {
				this.donneeFiltres = donneesFiltre;
				if (this.navigationService.isResultatsDetailles() && this.donneeFiltres.annee &&
					this.donneeFiltres.typeScrutin && this.donneeFiltres.commissionLocale) {
					this.recupererResultatBureauVote(true);
				}
			}
		});
	}

	/**
	 * Traite la réception d'une notification en affichant ou mettant à jour le tableau des résultats gdéttaillés.
	 */
	handleNotification(): void {
		this.notificationService.notificationChange.subscribe((message) => {
			const codeCirconscription = message.circonscription.code;
			const codeRegion = message.region.code;
			if (this.navigationService.isResultatsDetailles() &&
					(this.donneeFiltres.circonscription?.indexOf(codeCirconscription) != -1 ||
					this.donneeFiltres.region?.indexOf(codeRegion) != -1) &&
					!this.donneeFiltres.commissionLocale) {
				this.messageService.add({
					key: 'notification',
					severity: 'success',
					summary: 'Mise à jour des données',
					detail: message.nom,
					icon: 'pi-file'
				});
				this.recupererResultatBureauVote(false);
			}
		});
	}

	/**
	 * Récupère la liste des résultats des bureaux de vote d'une circonscripion
	 * @public
	 */
	public recupererResultatBureauVote(isNotification = true): void {
		this.loading = isNotification;
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin && this.donneeFiltres.commissionLocale) {
			this.resultatService.recupererListeResultatParBureauVote(this.donneeFiltres).subscribe({
				next: (resultats) => {
					this.resultats = resultats;
					this.tailleTableau += this.resultats[0].resultatCandidats.length;
					this.commissionLocale = resultats[0]?.commissionLocale.designation;
					this.resultats.forEach((element) => {
						element.resultatCandidats.forEach((element1) => {
							const exportResultatBureauVote: ExportResultatBureauVote = new ExportResultatBureauVote();
							exportResultatBureauVote.codeLieuVote = element.codeLieuVote;
							exportResultatBureauVote.lieuVote = element.designationLieuVote;
							exportResultatBureauVote.BureauVote = element.codeBureauVote;
							exportResultatBureauVote.inscrits = element.nombreInscrits;
							exportResultatBureauVote.nombreHommeVotant = element.nombreHommesVotants;
							exportResultatBureauVote.nombreFemmeVotant = element.nombreFemmesVotantes;
							exportResultatBureauVote.totalVotant = element.totalVotants;
							exportResultatBureauVote.tauxParticipation = element.tauxParticipation;
							exportResultatBureauVote.nombreBulletinBlanc = element.nombreBulletinsBlancs;
							exportResultatBureauVote.nombreBulletinNull = element.nombreBulletinsNuls;
							exportResultatBureauVote.suffrageExprimes = element.sufragesExprimes;
							exportResultatBureauVote.candidat = element1.candidat;
							exportResultatBureauVote.score = element1.score;
							this.exportResultatsBureauVote.push(exportResultatBureauVote);
						});
					});
					this.calculDesTotaux(this.resultats);
					this.listeCandidats = this.resultats.length > 0 ? this.resultats[0].resultatCandidats.sort(result => result.ordre) : [];
				},
				complete: () => {
					this.loading = false;
				}
			});
		} else {
			this.loading = false;
		}
	}

	/**
	 * Récupère les voix des candidats
	 * @public
	 * @param resultat
	 * @param ordre
	 */
	public recupererVoix(resultat: DetailResultat, ordre: number): number {
		const resultatCandidat = resultat.resultatCandidats.find(resul => resul.ordre === ordre);
		return resultatCandidat != null ? resultatCandidat.score : null;
	}

	/**
	 * Calcule le total des résultats (nombre total d'inscrire, de votant, de participation etc...) d'un bureau de vote.
	 * @public
	 * @param totals
	 * @constructor
	 */
	public calculDesTotaux(totals: DetailResultat[]): void {
		this.total = new TotalResultat();
		if (totals.length) {
			for (let total of totals) {
				this.total.totalInscrits += total.nombreInscrits;
				this.total.totalNombreHommes += total.nombreHommesVotants;
				this.total.totalNombreFemmes += total.nombreFemmesVotantes;
				this.total.totalVotants += total.totalVotants;
				this.total.totalTauxParticipations += total.tauxParticipation;
				this.total.totalBulletinNulls += total.nombreBulletinsNuls;
				this.total.totalBulletinBlancs += total.nombreBulletinsBlancs;
				this.total.totalSuffrageExprimes += total.sufragesExprimes;
			}
			this.total.totalTauxParticipations = (this.total.totalVotants / this.total.totalInscrits) * 100
		}
	}

	/**
	 * Calcule le total des voix du candidat dans tous les bureaux de vote.
	 * @public
	 * @param id l'identifiant du candidat.
	 */
	public sommeVoixCandidat(id: number): number {
		return this.resultats.flatMap(resultat => resultat.resultatCandidats)
				.filter(resultatCandidat => resultatCandidat.id === id)
				.map(candidat => candidat.score)
				.reduce((voix1, voix2) => voix1 + voix2);
	}

	/**
	 * Rétourne la liste des couleurs des partis politiques
	 * @public
	 * @param id
	 */
	public couleurPartiPolitique(id: number): any {
		const couleur = this.listeCandidats.filter(resultatCandidat => resultatCandidat.id === id).map(candidat => candidat.codeCouleur);
		return couleur[0];
	}

	/**
	 * Rétourne la valeur saisie dans le filtre (input) pour le filtrage global
	 * @public
	 * @param $event
	 */
	public getEventValue($event: any): string {
		return $event.target.value;
	}

	/**
	 * Exporter les données au format Excel
	 * @public
	 */
	public exportExcel(): void {
		import('xlsx').then(xlsx => {
			let Heading = [['Code du lieu de vote',
				'Lieu de vote', 'code du Bureau de vote',
				'Nombre d\'inscrire',
				'Nombre d\'homme votant',
				'Nombre de femme votante',
				'Total votant',
				'Taux de participation',
				'Nombre de bulletin nulls',
				'Nombre de bulletin blancs',
				'suffrage exprimes', 'Candidat',
				'Score']];
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet([]);
			xlsx.utils.sheet_add_aoa(ws, Heading);
			xlsx.utils.sheet_add_json(ws, this.exportResultatsBureauVote, { origin: 'A2', skipHeader: true });
			xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
			xlsx.writeFile(wb, ['RESULTAT_ELECTION', this.donneeFiltres.typeScrutin, this.donneeFiltres.annee, this.commissionLocale + '.xlsx'].join('_'));
		});
	}

	/**
	 * Exporter les données au format Csv
	 * @public
	 */
	public exportCSV(): void {
		import('xlsx').then(xlsx => {
			let HeadingCSV = [['Code du lieu de vote',
				'Lieu de vote', 'code du Bureau de vote',
				'Nombre d\'inscrire',
				'Nombre d\'homme votant',
				'Nombre de femme votante',
				'Total votant',
				'Taux de participation',
				'Nombre de bulletin nulls',
				'Nombre de bulletin blancs',
				'suffrage exprimes', 'Candidat',
				'Score']];
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet([]);
			xlsx.utils.sheet_add_aoa(ws, HeadingCSV);
			xlsx.utils.sheet_add_json(ws, this.exportResultatsBureauVote, { origin: 'A2', skipHeader: true });
			xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
			xlsx.writeFile(wb, ['RESULTAT_ELECTION', this.donneeFiltres.typeScrutin, this.donneeFiltres.annee, this.commissionLocale + '.csv'].join('_'));
		});
	}
}
