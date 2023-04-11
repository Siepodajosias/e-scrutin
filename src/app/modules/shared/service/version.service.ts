import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from 'src/app/modules/shared/service/urls';
import { HttpClient } from '@angular/common/http';
import { Version } from 'src/app/modules/shared/model/version';

@Injectable({
	providedIn: 'root'
})
export class VersionService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Recupère la version de la partie backend du projet.
	 */
	public recupererVersionBackend(): Observable<Version> {
		return this.http.get<Version>(urls.version);
	}
}
