import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from "./urls";
import {Participations} from "../model/participations";
import {DonneesFiltre} from "../model/donnees-filtre";

@Injectable({
	providedIn: 'root'
})
export class ParticipationService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Récuperation des participations par lieu de vote et par scrutin
	 *
	 * @param donneesFiltre les données du filtres.
	 * @return la liste des participations.
	 */
	recupererParticipationLieuVoteScrutin(donneesFiltre: DonneesFiltre): Observable<Participations[]> {
		const httpParams = DonneesFiltre.construireParametres(donneesFiltre.annee, donneesFiltre.typeScrutin, donneesFiltre.tour, donneesFiltre.region,
			donneesFiltre.circonscription, donneesFiltre.commissionLocale);
		return this.http.get<Participations[]>([urls.participation, '/lister'].join('/'), {params: httpParams});
	}

	/**
	 * Récuperation des participations par lieu de vote et par scrutin
	 *
	 * @param annee l'année électorale.
	 * @param typeScrutin le type de scrutin.
	 * @param tourScrutin le tour du scrutin.
	 * @param idBureauVote l'identifiant du bureau de vote.
	 */
	recupererParticipationBureauVoteScrutin(annee: number, typeScrutin: string, tourScrutin: string, idBureauVote: string): Observable<any> {
		let httpParams = new HttpParams();
		httpParams = httpParams.set('annee', String(annee));
		httpParams = httpParams.set('type', typeScrutin);
		httpParams = httpParams.set('tour', tourScrutin);
		httpParams = httpParams.set('bureauVote', idBureauVote);

		return this.http.get<any>(urls.participation, {params: httpParams});
	}
}
