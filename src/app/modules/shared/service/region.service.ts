import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from "./urls";
import {Region} from "../model/region";

@Injectable({
	providedIn: 'root'
})
export class RegionService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Récuperer la liste des regions
	 * @return Region[]
	 */
	recupererListeRegion(): Observable<Region[]> {
		return this.http.get<Region[]>(urls.zone + '/region/lister');
	}
}
