import { Component, Input } from '@angular/core';
import { Election } from '../../model/scrutin';
import { Region } from '../../model/region';
import { SelectItem } from 'primeng/api';
import { Circonscription } from '../../model/circonscription';
import { DonneesFiltre } from '../../model/donnees-filtre';
import { RegionService } from '../../service/region.service';
import { NavigationService } from '../../service/navigation.service';
import { FiltreService } from '../../service/filtre.service';
import { CirconscriptionService } from '../../service/circonscription.service';
import { CommissionLocaleService } from '../../service/commission-locale.service';
import { CommissionLocale } from '../../model/commission-locale';
import { CodeDesignation } from "../../model/code-designation";
import { ElectionService } from '../../service/election.service';
import {INavBarData} from "../sidebar/inavbadata";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	scrutins: Election[];
	election: Election;
	regions: Region[];
	choixFiltreRegion: SelectItem[];
	regionSelectionnees: Region[];
	circonscriptions: Circonscription[];
	optionsFiltreCirconscription: SelectItem[];
	circonscriptionSelectionnees: Circonscription[];
	commissionLocales: CommissionLocale[];
	optionsFiltreCommissionLocale: SelectItem[];
	commissionLocaleSelectionnees: CommissionLocale[];
	annees: number[];
	anneeSelectionnee: number;
	typeScrutins: string[];
	typeScrutinSelectionne: string;
	tours: CodeDesignation[] = [];
	tourSelectionne: CodeDesignation;
	idRegions: string;
	loading = false;
	@Input() collapsed = true;
	@Input() screenWidth = 0;

	donneeFitres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();
	readonly DECOUPAGE_REGION = 'REGION';
	readonly DECOUPAGE_COMMUNE = 'COMMUNE';
	decoupage: string = this.DECOUPAGE_REGION;

	constructor(private electionService: ElectionService,
				private regionService: RegionService,
				private navigationService: NavigationService,
				private filtreService: FiltreService,
				private circonscriptionService: CirconscriptionService,
				private commissionLocaleService: CommissionLocaleService) {}

	ngOnInit(): void {
		this.recupererAnnee(true);
		this.recupererRegion();
		this.decoupage = localStorage.getItem('decoupage') ? localStorage.getItem('decoupage') : this.DECOUPAGE_REGION;
		this.donneeFitres.decoupage = this.decoupage;
		this.filtreService.filtreChange.next(this.donneeFitres);
	}

	isCarteInteractive(): boolean {
		return this.navigationService.isCarteInteractive();
	}

	public recupererClassBody(): string {
		let styleclass = '';
		if (this.collapsed && this.screenWidth > 768) {
			styleclass = 'body-trimmed';
		} else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
			styleclass = 'body-md-screen';
		}
		return styleclass;
	}

	/**
	 * Récupère la liste des années électorales.
	 */
	public recupererAnnee(isRefresh = false): void {
		this.electionService.recupererAnneeScrutin().subscribe({
			next: (annees) => {
				this.annees = annees.sort().reverse();
				if (this.donneeFitres.annee && isRefresh) {
					this.anneeSelectionnee = this.donneeFitres.annee;
				} else if (this.annees?.length === 1) {
					this.anneeSelectionnee = this.annees[0];
				}
				if (this.anneeSelectionnee) {
					this.recupererTypeScrutin(isRefresh);
				}
			}
		});
	}

	/**
	 * Récupère la liste des types de scrutins
	 */
	public recupererTypeScrutin(isRefresh = false): void {
		this.electionService.recupererTypeScrutin().subscribe({
			next: (data) => {
				this.typeScrutins = Array.from(new Set<string>(data?.filter(val => val.annee === this.anneeSelectionnee)
						.map(scrutin => scrutin.type))).sort();
				if (this.donneeFitres.typeScrutin?.length && isRefresh) {
					this.typeScrutinSelectionne = this.donneeFitres.typeScrutin;
				} else if (this.typeScrutins.length === 1) {
					this.typeScrutinSelectionne = this.typeScrutins[0];
				}
				if (this.anneeSelectionnee && this.typeScrutinSelectionne) {
					this.recupererTourScrutinParAnneeEtType(isRefresh);
				}
			}
		});
	}

	/**
	 * Récupère le tour (1e, 2e, 3e etc...) du scrutin en cour
	 */
	public recupererTourScrutinParAnneeEtType(isRefresh = false): void {
		this.electionService.recupererTourScrutinParAnneeEtType(this.anneeSelectionnee, this.typeScrutinSelectionne).subscribe({
			next: (data) => {
				this.tours = data;
				if (this.donneeFitres.tour?.length && isRefresh) {
					this.tourSelectionne = this.tours.find(tour => tour.code === this.donneeFitres.tour);
				} else if (this.tours.length === 1) {
					this.tourSelectionne = this.tours[0];
				}
				if (this.anneeSelectionnee && this.typeScrutinSelectionne && this.typeScrutinSelectionne) {
					if (this.donneeFitres.region?.length && isRefresh) {
						this.regionSelectionnees = this.regions?.filter(r => this.donneeFitres.region.split(',').includes(r.code.toString()));
					} else if (this.regions?.length === 1) {
						this.regionSelectionnees = this.regions;
					}
					if (this.regionSelectionnees?.length) {
						this.recupererCirconscription(isRefresh);
					}
				}
			}
		});
	}

	/**
	 * Récupère la liste des regions
	 */
	public recupererRegion(): void {
		this.regionService.recupererListeRegion().subscribe({
			next: (regions) => {
				this.regions = regions?.sort();
				this.choixFiltreRegion = this.construireOptionfiltres(this.regions);
				if (this.regions?.length === 1) {
					this.regionSelectionnees = this.regions;
					this.onSelectionRegion();
				}
			}
		});
	}

	/**
	 * Récupère la liste des départements
	 */
	public recupererCirconscription(isRefresh = false): void {
		const codeRegions = this.regionSelectionnees?.map(r => r.code).join(',');
		this.circonscriptionService.recupererCirconscription(this.anneeSelectionnee, this.typeScrutinSelectionne, codeRegions).subscribe({
			next: (data) => {
				this.circonscriptions = data;
				this.circonscriptions?.sort((c1, c2) => c1.designation.localeCompare(c2.designation))
				this.optionsFiltreCirconscription = this.construireOptionfiltres(this.circonscriptions);
				if (this.anneeSelectionnee && this.typeScrutinSelectionne && this.regionSelectionnees?.length &&
						this.regionSelectionnees?.length) {
					if (this.donneeFitres.circonscription?.length && isRefresh) {
						this.circonscriptionSelectionnees = this.circonscriptions.filter(c => this.donneeFitres.circonscription.split(',')
						 .includes(c.code.toString()));
					} else if (this.circonscriptions?.length === 1) {
						this.circonscriptionSelectionnees = this.circonscriptions;
					}
				}
				if (this.circonscriptionSelectionnees?.length) {
					this.recupererCommissionLocales(isRefresh);
				}
			}
		});
	}

	/**
	 * Récupère les commissions électorales locales.
	 */
	recupererCommissionLocales(isRefresh = false): void {
		const codeRegions = this.regionSelectionnees?.map(r => r.code).join(',');
		const codeCirconscriptions = this.circonscriptionSelectionnees?.map(c => c.code).join(',');
		this.commissionLocaleService.recupererCommissionLocale(codeRegions, codeCirconscriptions).subscribe(
				(data) => {
					this.commissionLocales = data.sort();
					this.optionsFiltreCommissionLocale = this.construireOptionfiltres(this.commissionLocales);
					if (this.anneeSelectionnee && this.typeScrutinSelectionne?.length && this.regionSelectionnees?.length &&
							this.circonscriptionSelectionnees?.length) {
						if (this.donneeFitres.commissionLocale?.length && isRefresh) {
							this.commissionLocaleSelectionnees = this.commissionLocales.filter(c => this.donneeFitres.commissionLocale.split(',')
								.includes(c.code.toString()));
						} else if (this.commissionLocales.length === 1) {
							this.commissionLocaleSelectionnees = this.commissionLocales;
						}
					}
				}
		);
	}

	/**
	 * Se déclenche lorsqu'une année est selectionnée
	 */
	public onSelectionAnnee(): void {
		this.typeScrutinSelectionne = null;
		this.typeScrutins = [];
		this.regionSelectionnees = [];
		this.circonscriptionSelectionnees = [];
		this.commissionLocaleSelectionnees = [];
		this.tours = [];
		this.tourSelectionne = undefined;
		if (this.anneeSelectionnee) {
			this.recupererTypeScrutin();
		}
	}

	/**
	 * Se déclenche lorsqu'un type de scrutin est selectionné
	 */
	public onSelectionTypeScrutin(): void {
		this.circonscriptions = [];
		this.circonscriptionSelectionnees = [];
		this.commissionLocales = [];
		this.commissionLocaleSelectionnees = [];
		this.tours = [];
		this.tourSelectionne = undefined;
		this.recupererTypeScrutin();
	}
	/**
	 * Se déclenche quand un tour (1e, 2e, 3e etc...) est sélectionné
	 */
	onSelectionTour(): void {
		this.regionSelectionnees = [];
		this.circonscriptions = [];
		this.circonscriptionSelectionnees = [];
		this.commissionLocales = [];
		this.commissionLocaleSelectionnees = [];
		this.recupererTourScrutinParAnneeEtType();
	}

	/**
	 * Se déclenche lorsqu'une region est selectionnée
	 */
	public onSelectionRegion(): void {
		this.circonscriptionSelectionnees = [];
		this.circonscriptions = [];
		this.commissionLocaleSelectionnees = [];
		this.commissionLocales = [];
		if (this.regionSelectionnees?.length) {
			this.recupererCirconscription();
		}
	}

	/**
	 * Se déclenche lorsqu'une circonscription est selectionné
	 */
	public onSelectionCirconscription(): void {
		this.commissionLocaleSelectionnees = [];
		if (this.circonscriptionSelectionnees?.length) {
			this.recupererCommissionLocales();
		}
	}

	/**
	 * Cette fonction permet de valider les filtres
	 */
	public validerfiltre(): void {
		const donneesFiltre = new DonneesFiltre();
		donneesFiltre.annee = this.anneeSelectionnee;
		donneesFiltre.typeScrutin = this.typeScrutinSelectionne;
		donneesFiltre.tour = this.tourSelectionne.code;
		donneesFiltre.region = this.regionSelectionnees?.map(r => r.code).join(',');
		donneesFiltre.circonscription = this.circonscriptionSelectionnees?.map(c => c.code).join(',');
		donneesFiltre.commissionLocale = this.commissionLocaleSelectionnees?.map(c => c.code).join(',');
		donneesFiltre.decoupage = this.decoupage;
		this.filtreService.filtreChange.next(donneesFiltre);
		this.stockerFiltresLocalStorage();
	}

	/**
	 * Stocker les valeurs pour les filtres globaux.
	 */
	public stockerFiltresLocalStorage(): void {
		localStorage.setItem('annee', this.anneeSelectionnee?.toString());
		localStorage.setItem('typeScrutin', this.typeScrutinSelectionne);
		localStorage.setItem('tour', this.tourSelectionne.code);
		localStorage.setItem('codeRegion', this.regionSelectionnees ?
				this.regionSelectionnees.map(c => c.code.toString()).join(',') : '');
		localStorage.setItem('codeCirconscription', this.circonscriptionSelectionnees ?
				this.circonscriptionSelectionnees.map(c => c.code.toString()).join(',') : '');
		localStorage.setItem('codeCommissionLocale', this.commissionLocaleSelectionnees ?
				this.commissionLocaleSelectionnees.map(c => c.code.toString()).join(',') : '');
		localStorage.setItem('decoupage', this.decoupage);
	}

	/**
	 * Permet de vider toutes les valeurs des filtres
	 */
	viderfiltre(): void {
		this.anneeSelectionnee = null;
		this.typeScrutinSelectionne = null;
		this.regionSelectionnees = [];
		this.commissionLocaleSelectionnees = [];
		this.circonscriptionSelectionnees = [];
		this.decoupage = 'REGION';

		localStorage.removeItem('annee');
		localStorage.removeItem('typeScrutin');
		localStorage.removeItem('tour');
		localStorage.removeItem('codeCommissionLocale');
		localStorage.removeItem('labelCommissionLocale');
		localStorage.removeItem('codeRegion');
		localStorage.removeItem('codeCirconscription');
		localStorage.removeItem('decoupage');
		if (this.annees?.length === 1) {
			this.anneeSelectionnee = this.annees[0];
			this.onSelectionAnnee();
		}
	}

	/**
	 * Contruit les options d'un multiselect.
	 * @param data la liste des données source.
	 */
	construireOptionfiltres(data: any[]): SelectItem[] {
		return data?.map(objet => {
			return {
				code: objet.code,
				value: objet.designation,
				id: objet.id
			};
		});
	}

	isResultatsDetailles() {
		return this.navigationService.isResultatsDetailles();
	}

	/**
	 * Retourne true s'il faute désactiver le bouton de recherche.
	 */
	desactiverBoutonFiltre(): boolean {
		return ((!this.anneeSelectionnee || !this.typeScrutinSelectionne || !this.tourSelectionne) && !this.isResultatsDetailles()) ||
			   ((!this.anneeSelectionnee || !this.typeScrutinSelectionne || !this.tourSelectionne || !this.regionSelectionnees?.length ||
			   !this.circonscriptionSelectionnees?.length || this.commissionLocaleSelectionnees?.length !== 1) && this.isResultatsDetailles())
	}

	/**
	 * Retourne true si le menu est sélectionné.
	 */
	isAfficherHeader(): boolean {
		const url = window.location.href;
		return !url.includes('administration');
	}
}
