import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {urls} from "./urls";
import {Election} from "../model/scrutin";
import {CodeDesignation} from "../model/code-designation";

@Injectable({
	providedIn: 'root'
})
export class ElectionService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Récuperation des années
	 * @return number
	 */
	recupererAnneeScrutin(): Observable<number[]> {
		return this.http.get<number[]>(urls.election + '/annees');
	}

	/**
	 * Récuperation les types de scrutin
	 * @return Scrutin[]
	 */
	recupererTypeScrutin(): Observable<Election[]> {
		return this.http.get<Election[]>(urls.election + '/lister');
	}

	/**
	 * Récuperation des scrutins en fonction de l'année et du type de scrutin
	 * @return Scrutin[]
	 */
	recupererTourScrutinParAnneeEtType(annee: number, type: string): Observable<CodeDesignation[]> {
		return this.http.get<CodeDesignation[]>(urls.election + '/tour/' + annee + '/' + type);
	}
}
