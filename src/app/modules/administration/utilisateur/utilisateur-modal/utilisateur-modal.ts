import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Utilisateur } from 'src/app/modules/shared/model/utilisateur';
import { UtilisateurService } from 'src/app/modules/shared/service/utilisateur.service';
import { RoleUtils } from '../../../shared/utils/role-utils';

@Component({
	selector: 'utilisateur-modal',
	templateUrl: './utilisateur-modal.html',
	styleUrls: ['./utilisateur-modal.scss']
})
export class UtilisateurModal implements OnInit {
	readonly MESSAGE_CHAMP_OBLIGATOIRE = 'Ce champ est obligatoire';
	@Input() visible: boolean;
	@Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() utilisateur: Utilisateur;
	@Input() actions?: string;
	@Output() utilisateurModifie: EventEmitter<void> = new EventEmitter<void>();
	utilisateurForm: FormGroup;
	roles = RoleUtils.tousLesRoles();
	loading = false;

	constructor(private formBuilder: FormBuilder,
				private messageService: MessageService,
				private utilisateurService: UtilisateurService) {
	}

	ngOnInit(): void {
		this.creerFormulaire();
	}

	/**
	 * Callback appelée à l'ouverture de la modal.
	 */
	public onOuverture(): void {
		if (this.utilisateur?.id) {
			this.initialiserFormulaire(this.utilisateur);
		}
	}

	/**
	 * Initalise le formulaire pour modification.
	 *
	 * @param utilisateur l'utilisateur à modifier.
	 */
	public initialiserFormulaire(utilisateur?: Utilisateur): void {
		this.utilisateurForm.patchValue({
			id: utilisateur.id,
			nom: utilisateur.nom,
			prenoms: utilisateur.prenoms,
			username: utilisateur.username,
			role: RoleUtils.getRole(utilisateur.role),
			statut: utilisateur.statut
		});
	}

	/**
	 * Enregistre et modifie les utilisateurs.
	 */
	public enregistrer(): void {
		if (this.utilisateurForm.valid) {
			const utilisateur = Object.assign(new Utilisateur(), this.utilisateurForm.getRawValue());
			utilisateur.role = this.utilisateurForm.get('role')?.value.code;
			this.enregistrerUtilisateur(utilisateur);
		}
	}

	/**
	 * Ferme la modal.
	 */
	public fermerModal(): void {
		this.visibleChange.emit(false);
		this.utilisateurForm.reset();
	}

	/**
	 * Enregistre un utilisateur.
	 *
	 * @param utilisateur l'utilisateur à enregistrer.
	 */
	private enregistrerUtilisateur(utilisateur: Utilisateur): void {
		this.loading = true;
		this.utilisateurService.enregistrerUtilisateur(utilisateur).subscribe({
			next: () => {
				this.utilisateurModifie.emit();
				this.messageService.add({
					severity: 'success',
					summary: 'Succès',
					detail: 'Utilisateur enregistré'
				});
				this.loading = false;
				this.fermerModal();
			},
			error: () => {
				this.messageService.add({
					severity: 'error',
					sticky: true,
					summary: 'Erreur',
					detail: 'Echec d\'enregistrement.'
				});
			}
		});
	}

	/**
	 * Retourne true si le feedcack du champ doit être affiché.
	 *
	 * @param formControl le champ à contrôler.
	 * @param isSubmit true si le formulaire est validé.
	 * @return true si le champ est invalide.
	 */
	isAfficherFeedBackError(formControl: AbstractControl, isSubmit: boolean): boolean {
		return (formControl.invalid && (formControl.dirty || formControl.touched)) || (formControl.invalid && isSubmit);
	}

	/**
	 * Retourne true si le feedcack du champ doit être affiché.
	 *
	 * @param formControl le champ à contrôler.
	 * @param isSubmit true si le formulaire est validé.
	 * @return true si le champ est invalide.
	 */
	isInvalide(formControl: AbstractControl, isSubmit: boolean): boolean {
		return formControl.invalid && isSubmit;
	}

	/**
	 * Affiche le titre de la modal selon l'action.
	 */
	afficherTitre(): string {
		return this.utilisateur.id != null ? 'Modifier utilisateur ' + this.utilisateur.username : ' Créer utilisateur';
	}

	/**
	 * Crée le formulire en fonction de l'action choisie (modification du statut, de l'utilisateur ou enregistrement d'un utilisteur).
	 *
	 * @private
	 */
	private creerFormulaire(): void {
		if (this.actions === 'editerStatut') {
			this.utilisateurForm = this.formBuilder.group({
				id: [''],
				nom: {value: '', disabled: true},
				prenoms: {value: '', disabled: true},
				username: {value: '', disabled: true},
				password: ['azerty'],
				role: {value: '', disabled: true},
				statut: ['']
			});
		} else {
			this.utilisateurForm = this.formBuilder.group({
				id: [''],
				nom: ['', Validators.required],
				prenoms: ['', Validators.required],
				username: ['', Validators.required],
				password: ['azerty'],
				role: ['', Validators.required],
				statut: ['NOUVEAU']
			});
		}
	}
}
