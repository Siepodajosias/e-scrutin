import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {urls} from "./urls";
import {Circonscription} from "../model/circonscription";

@Injectable({
	providedIn: 'root'
})
export class CirconscriptionService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Récuperer la liste des circonscriptions.
	 * @return Departement[]
	 */
	recupererCirconscription(annee: number, typeScrutin: string, codesRegions: string): Observable<Circonscription[]> {
		let httpParams = new HttpParams();
		if (codesRegions) {
			httpParams = httpParams.set('codesRegions', String(codesRegions));
		}
		return this.http.get<Circonscription[]>(urls.circonscription + '/lister', { params: httpParams });
	}
}
