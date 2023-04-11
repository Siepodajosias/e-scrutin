import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { urls } from "./urls";
import { Token } from "../model/token";
import { Credentials } from "../model/credentials";
import { Utilisateur } from "../model/utilisateur";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private jwtToken: string;

	constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
	}

	/**
	 * Authentifie un utilisateur.
	 *
	 * @param credentials les accès de l'utilisateur.
	 */
	authentifier(credentials: Credentials): Observable<Token> {
		return this.http.post<Token>(urls.connexion, credentials);
	}

	/**
	 * Cette méthode permet d'enregistrer le token dans le localStorage après l'authentification
	 * @param jwtToken
	 */
	enregistrerToken(jwtToken: string): void {
		this.jwtToken = jwtToken;
		localStorage.setItem('token', jwtToken);
	}

	/**
	 * Cette méthode permet de recuperer le token dans le localStorage après l'authentification
	 * @return any
	 */
	recupererToken(): string {
		const token = localStorage.getItem('token');
		return token ? token : '';
	}

	/**
	 * Retourne ture si un utilisateur est authentifié.
	 */
	isAuthenticated(): boolean {
		const token = this.recupererToken();
		if (token) {
			return !this.jwtHelper.isTokenExpired(token);
		}
		return false;
	}

	/**
	 * Recupère l'utilisateur à partir du token jwt.
	 */
	getUtilisateurConnecte(): Utilisateur {
		if (this.isAuthenticated()) {
			return this.decoderToken(this.recupererToken());
		}
		return null;
	}

	/**
	 * Décode le jwt token.
	 *
	 * @param jwtToken le token jwt.
	 */
	decoderToken(jwtToken: string) {
		const token = this.jwtHelper.decodeToken(jwtToken);
		const utilisateur = new Utilisateur();
		utilisateur.id = token.id;
		utilisateur.nom = token.nom;
		utilisateur.prenoms = token.prenoms;
		utilisateur.username = token.username;
		utilisateur.role = token.role;
		utilisateur.statut = token.statut;

		return utilisateur;
	}

	/**
	 * Retourne le rôle de l'utilisateur connecté.
	 */
	getRoleUtilisateurConnecte(): string {
		return this.getUtilisateurConnecte()?.role;
	}
}
