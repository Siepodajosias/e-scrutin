import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from 'src/app/modules/shared/model/utilisateur';
import { Observable } from 'rxjs';
import { urls } from 'src/app/modules/shared/service/urls';

@Injectable({
	providedIn: 'root'
})
export class UtilisateurService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Crée un utilisateur.
	 *
	 * @param utilisateur l'utilisateur.
	 */
	public enregistrerUtilisateur(utilisateur: Utilisateur): Observable<void> {
		return this.http.post<void>(urls.utilisateur + '/creer', utilisateur);
	}

	/**
	 * Modifie le mot de passe d'un utilisateur.
	 *
	 * @param utilisateur l'utilisateur.
	 */
	public modifierMotDePasseUtilisateur(utilisateur: Utilisateur): Observable<void> {
		return this.http.post<void>(urls.utilisateur + '/modifier-mot-de-passe', utilisateur);
	}

	/**
	 * Désactive un utilisateur.
	 *
	 * @param utilisateur l'utilisateur.
	 */
	public desactiverUtilisateur(utilisateur: Utilisateur): Observable<void> {
		return this.http.post<void>(urls.utilisateur + '/activer-ou-desactiver', utilisateur);
	}

	/**
	 * Liste les utilisateurs.
	 *
	 * @return la liste des utilisateurs.
	 */
	public recupererUtilisateur(): Observable<Utilisateur[]> {
		return this.http.get<Utilisateur[]>(urls.utilisateur + '/lister');
	}

	/**
	 * Supprime un utilisateur.
	 *
	 * @param idUtilisateur l'identifiant de l'utilisateur à supprimer.
	 */
	public supprimerUtilisateur(idUtilisateur: number): Observable<any> {
		return this.http.delete(urls.utilisateur + '/supprimer/' + idUtilisateur);
	}
}
