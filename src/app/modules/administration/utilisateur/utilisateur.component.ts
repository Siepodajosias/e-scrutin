import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/modules/shared/model/utilisateur';
import { UtilisateurService } from 'src/app/modules/shared/service/utilisateur.service';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { RoleUtils } from '../../shared/utils/role-utils';
import { NotificationUtils } from "../../shared/utils/notification-utils";

@Component({
	selector: 'app-utilisateur',
	templateUrl: './utilisateur.component.html',
	styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {
	modalUtilisateurVisible: boolean = false;
	utilisateur: Utilisateur;
	utilisateurs: Utilisateur[];
	loading = false;
	roles = RoleUtils.tousLesRoles();
	actions?: string;
	readonly STATUT_INACTIF = 'INACTIF';
	readonly STATUT_ACTIF = 'ACTIF';
	readonly STATUT_NOUVEAU = 'NOUVEAU';

	constructor(private messageService: MessageService,
				private utilisateurService: UtilisateurService,
				private confirmationService: ConfirmationService,
				private primeNgConfig: PrimeNGConfig) {
	}

	ngOnInit(): void {
		this.recupererUtilisateurs();
		this.recupererTradctionFiltre();
	}

	/**
	 * Ouvre la modal d'édition d'un utilisateur.
	 *
	 * @param utilisateur l'utilisateur.
	 */
	public ouvrirModalEdition(utilisateur?: Utilisateur): void {
		this.utilisateur = utilisateur?.id ? utilisateur : new Utilisateur();
		this.modalUtilisateurVisible = true;
	}

	/**
	 * Supprime un utilisateur du système.
	 * @param utilisateur: Utilisateur à supprimer.
	 */
	public supprimerUtilisateur(utilisateur: any): void {
		this.confirmationService.confirm({
			message: 'Voulez-vous vraiment supprimer l\'utilisateur ' + utilisateur.prenoms + ' ' + utilisateur.nom + '?',
			header: 'Confirmer',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.retirerUtilisateur(utilisateur);
			}
		});
	}

	/**
	 * Retire un utilisateur sur système.
	 * @param utilisateur: Utilisateur à retirer.
	 */
	public retirerUtilisateur(utilisateur: any): void {
		this.utilisateurService.supprimerUtilisateur(utilisateur.id).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: 'Suppression',
					detail: 'l\'utilisateur a été supprimé',
					icon: 'pi-file'
				});
				this.utilisateurs = this.utilisateurs.filter(val => val.id !== utilisateur.id);
			},
			error: () => {
				this.messageService.add({
					sticky: true,
					severity: 'error',
					summary: 'Erreur',
					detail: 'l\'utilisateur ne peut pas être supprimé',
					icon: 'pi-file'
				});
			}
		});
	}

	/**
	 * Recupère la liste des utilisateurs.
	 */
	recupererUtilisateurs(): void {
		this.loading = true;
		this.utilisateurService.recupererUtilisateur().subscribe({
				next: (utilisateurs) => {
					this.utilisateurs = utilisateurs;
					this.loading = false;
				},
				error: () => {
					this.messageService.add({
						sticky: true,
						severity: 'error',
						summary: 'Erreur',
						detail: 'Les données n\'ont pas pu être chargées',
						icon: 'pi-file'
					});
					this.loading = false;
				}
			}
		);
	}

	/**
	 * Traduit les filtres en français.
	 */
	public recupererTradctionFiltre(): void {
		this.primeNgConfig.setTranslation({
			startsWith: 'Commence par',
			contains: 'Contient',
			notContains: 'Ne contient pas',
			endsWith: 'Fini par',
			equals: 'Egale à',
			notEquals: 'Différent de',
			noFilter: 'Pas de filtre',
			reject: 'Non',
			accept: 'Oui'
		});
	}

	/**
	 * Retourne la désignation du rôle.
	 *
	 * @param codeRole le code du rôle de l'utilisateur
	 */
	afficherRole(codeRole: string) {
		return RoleUtils.getRole(codeRole)?.designation;
	}

	/**
	 * Désactive un utilisateur.
	 *
	 * @param utilisateur l'utilisateur.
	 * @param isActivation true si l'action est une activation.
	 */
	activerOuDesactiverUtilisateur(utilisateur: Utilisateur, isActivation: boolean): void {
		utilisateur.statut = isActivation ? this.STATUT_NOUVEAU : this.STATUT_INACTIF;
		const message = isActivation ? 'Utilisateur activé' : 'Utilisateur désactivé';
		this.utilisateurService.desactiverUtilisateur(utilisateur).subscribe({
			next: () => {
				NotificationUtils.afficherToast(
					this.messageService,
					'success',
					'Succès',
					message);
			},
			error: (err) => {
				NotificationUtils.afficherToast(
					this.messageService,
					'error',
					'Erreur',
					'La désactivation de l\'utilisateur a échouée');
			}
		})
	}
}
