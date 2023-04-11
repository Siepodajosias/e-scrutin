import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { Credentials } from '../../shared/model/credentials';
import { NavigationService } from '../../shared/service/navigation.service';
import { Utilisateur } from 'src/app/modules/shared/model/utilisateur';

@Component({
	selector: 'app-connexion',
	templateUrl: './connexion.html',
	styleUrls: ['./connexion.scss']
})
export class Connexion {
	loginForm: FormGroup;
	messageActif = false;
	messageErreur: string;
	isLoading = false;
	utilisateur: Utilisateur;
	modalPasswodEditVisible: boolean = false;
	token: string;
	readonly STATUT_NOUVEAU = 'NOUVEAU';
	readonly STATUT_INACTIF = 'INACTIF';

	constructor(private formBuilder: FormBuilder,
				private route: Router,
				private navigationService: NavigationService,
				private authService: AuthService) {
	}

	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.navigationService.goToDashbord();
		}
		this.loginForm = this.formBuilder.group({
			login: ['', [Validators.required, Validators.maxLength(200)]],
			motPasse: ['', [Validators.required, Validators.maxLength(200)]]
		});
	}

	/**
	 * Authentifie l'utilisateur.
	 */
	connexion(): void {
		if (this.loginForm.invalid) {
			this.messageErreur = 'Renseignez tous les champs';
			this.messageActif = true;
		} else {
			const utilisateur: Credentials = new Credentials(
				this.loginForm.get('login').value,
				this.loginForm.get('motPasse')?.value
			);
			this.isLoading = true;
			this.messageActif = false;
			this.authService.authentifier(utilisateur).subscribe({
				next: (value) => {
					localStorage.clear();
					const jwtToken = value.token;
					const utilisateur: Utilisateur = this.authService.decoderToken(jwtToken);
					this.isLoading = false;
					if (utilisateur.statut === this.STATUT_INACTIF) {
						this.messageErreur = 'Cet utilisateur est inactif';
						this.messageActif = true;
					} else if (utilisateur.statut === this.STATUT_NOUVEAU) {
						this.ouvrirModalEditionPassword(utilisateur, jwtToken);
					} else {
						this.authService.enregistrerToken(jwtToken);
						this.navigationService.goToDashbord();
					}
				},
				error: (err) => {
					if (err.status === 403) {
						this.messageErreur = 'Nom d\'utilisateur ou mot de passe incorrect.';
					} else {
						this.messageErreur = 'Serveur indisponible';
					}
					this.messageActif = true;
					this.isLoading = false;
				}
			});
		}
	}

	/**
	 * Ouvre la modal d'édition d'un utilisateur.
	 *
	 * @param utilisateur l'utilisateur.
	 * @param token le token de l'utilisateur.
	 */
	public ouvrirModalEditionPassword(utilisateur: Utilisateur, token: string): void {
		this.utilisateur = utilisateur;
		this.token = token;
		this.modalPasswodEditVisible = true;
	}
}
