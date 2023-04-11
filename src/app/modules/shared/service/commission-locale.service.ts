import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from "./urls";
import {CommissionLocale} from "../model/commission-locale";

@Injectable({
	providedIn: 'root'
})
export class CommissionLocaleService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Récuperer la liste des commissions locales.
	 * @return CommissionLocale[]
	 */
	recupererCommissionLocale(idsRegion: string, idsCirconscription: string): Observable<CommissionLocale[]> {
		const params = new HttpParams()
			.set('region', idsRegion)
			.set('idsCirconscription', idsCirconscription);
		return this.http.get<CommissionLocale[]>(urls.commissionLocale, {params: params});
	}
}
