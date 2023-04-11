import { HttpParams } from '@angular/common/http';

export class DonneesFiltre {
	typeScrutin: string;
	tour: string;
	annee: number;
	region: string;
	circonscription: string;
	commissionLocale: string;
	decoupage: string;

	static initialiserDonneesFiltres(): DonneesFiltre {
		const donneeFitres: DonneesFiltre = new DonneesFiltre();
		donneeFitres.annee = Number(localStorage.getItem('annee'));
		donneeFitres.typeScrutin = localStorage.getItem('typeScrutin');
		donneeFitres.tour = localStorage.getItem('tour');
		donneeFitres.region = localStorage.getItem('codeRegion');
		donneeFitres.circonscription = localStorage.getItem('codeCirconscription');
		donneeFitres.commissionLocale = localStorage.getItem('codeCommissionLocale');
		donneeFitres.decoupage = localStorage.getItem('decoupage');
		return donneeFitres;
	}

	/**
	 * Construit les paramètres de la requête HTTP.
	 *
	 * @param annee l'année électorale.
	 * @param typeScrutin le type de scrutin.
	 * @param tour le tour du scrutin.
	 * @param codeRegions les codes des régions.
	 * @param codeCirconscriptions les codes des circonscriptions.
	 * @param codeCommissionLocales les codes des commissions locales.
	 * @param decoupage le découpage affiché.
	 */
	static construireParametres(annee: number, typeScrutin: string, tour?: string, codeRegions?: string, codeCirconscriptions?: string,
								codeCommissionLocales?: string, decoupage?: string): HttpParams {
		let httpParams = new HttpParams();

		if (annee) {
			httpParams = httpParams.set('annee', String(annee));
		}
		if (typeScrutin) {
			httpParams = httpParams.set('type', typeScrutin);
		}
		if (tour) {
			httpParams = httpParams.set('tour', tour);
		}
		if (codeRegions) {
			httpParams = httpParams.set('region', codeRegions);
		}
		if (codeCommissionLocales) {
			httpParams = httpParams.set('commissionLocale', codeCommissionLocales);
		}
		if (codeCirconscriptions) {
			httpParams = httpParams.set('circonscription', String(codeCirconscriptions));
		}
		if (decoupage) {
			httpParams = httpParams.set('decoupage', String(decoupage));
		}
		return httpParams;
	}
}
