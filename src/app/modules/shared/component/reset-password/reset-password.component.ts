import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Utilisateur } from 'src/app/modules/shared/model/utilisateur';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UtilisateurService } from 'src/app/modules/shared/service/utilisateur.service';
import { NavigationService } from 'src/app/modules/shared/service/navigation.service';
import { ValidatorsPassword } from 'src/app/modules/shared/validators/password.validator';
import { NotificationUtils } from "../../utils/notification-utils";
import { AuthService } from "../../service/auth.service";

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
	@Input() visible: boolean;
	@Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() utilisateur: Utilisateur;
	@Input() token: string;
	messageActif = false;
	messageErreur: string;
	loading: boolean = false;
	utilisateurForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
				private messageService: MessageService,
				private authService: AuthService,
				private utilisateurService: UtilisateurService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.utilisateurForm = this.formBuilder.group({
			username: {value: '', disabled: true},
			passwordFormGroup: this.formBuilder.group({
				password: ['', Validators.required],
				confirmPassword: ['', Validators.required]
			}, {validators: ValidatorsPassword}),
			statut: ['ACTIF']
		});
	}

	/**
	 * Modifie le mot de passe de l'utilisateur.
	 */
	public modifierMotDePasse(): void {
		this.loading = true;
		// TODO
		if (!this.utilisateurForm.get('passwordFormGroup.password')?.value?.length) {
			this.loading = false;
			this.messageErreur = 'Veuillez saisir un mot de passe';
			this.messageActif = true;
		} else if (this.utilisateurForm.invalid) {
			this.loading = false;
			this.messageErreur = 'Les mots de passe saisis ne correspondent pas';
			this.messageActif = true;
		} else if (this.utilisateurForm.get('passwordFormGroup.password')?.value?.length < 6) {
			this.loading = false;
			this.messageErreur = 'Le mot de passe doit contenir au moins 6 caractères';
			this.messageActif = true;
		}
		else if (this.utilisateurForm.get('passwordFormGroup.password')?.value === 'azerty') {
			this.loading = false;
			this.messageErreur = 'Vous ne pouvez pas utiliser ce mot de passe';
			this.messageActif = true;
		} else {
			const utilisateur: Utilisateur = new Utilisateur();
			utilisateur.id = this.utilisateur.id;
			utilisateur.nom = this.utilisateur.nom;
			utilisateur.prenoms = this.utilisateur.prenoms;
			utilisateur.role = this.utilisateur.role;
			utilisateur.username = this.utilisateurForm.get('username')?.value;
			utilisateur.password = this.utilisateurForm.get('passwordFormGroup.password')?.value;
			utilisateur.statut = this.utilisateurForm.get('statut')?.value;
			this.enregistrerMotDePasseUtilisateur(utilisateur);
		}
	}

	/**
	 * Enregistre l'utilisateur avec son nouveau mot de passe.
	 *
	 * @param utilisateur: L'utilisateur à enregistrer.
	 */
	enregistrerMotDePasseUtilisateur(utilisateur: Utilisateur): void {
		this.utilisateurService.modifierMotDePasseUtilisateur(utilisateur).subscribe({
			next: () => {
				this.authService.enregistrerToken(this.token);
				NotificationUtils.afficherToast(
					this.messageService,
					'success',
					'Succès',
					'Mot de passe modifié');
				this.loading = false;
				this.fermerModal();
				setTimeout(() => this.navigationService.goToDashbord(), 1000);
			},
			error: () => {
				this.loading = false;
				NotificationUtils.afficherToast(
					this.messageService,
					'error',
					'Erreur',
					'Echec de modification du mot de passe');
			}
		});
	}

	/**
	 * Callback appelée à l'ouverture de la modal.
	 */
	onOuverture(): void {
		if (this.utilisateur) {
			this.initialiserFormulaire(this.utilisateur);
		}
	}

	/**
	 * Initalise le formulaire pour modification.
	 *
	 * @param utilisateur: l'utilisateur à modifier.
	 * @public
	 */
	initialiserFormulaire(utilisateur?: Utilisateur): void {
		this.utilisateurForm.patchValue({
			username: utilisateur.username
		});
	}

	/**
	 * Ferme la modal.
	 * @public
	 */
	fermerModal(): void {
		this.visibleChange.emit(false);
		this.utilisateurForm.reset();
	}
}
