import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {NavbarData} from './nav-data';
import {INavBarData} from './inavbadata';
import {NavigationService} from '../../service/navigation.service';
import {AuthService} from '../../service/auth.service';
import {Utilisateur} from '../../model/utilisateur';
import {RoleUtils} from '../../utils/role-utils';
import {MenuItem} from 'primeng/api';

interface SideNavToggle {
	screenwidth: number;
	collapsed: boolean;
}

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({opacity: 0}),
				animate('350ms',
					style({opacity: 1})
				)
			]),
			transition(':leave', [
				style({opacity: 1}),
				animate('350ms',
					style({opacity: 0})
				)
			])
		]),
	]
})
export class SidebarComponent implements OnInit {

	@Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
	collapsed = true;
	screenwidth = 0;
	navData: INavBarData[] = [];
	multiple = false;
	utilisateur: Utilisateur;
	modalPasswodEditVisible: boolean = false;

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.screenwidth = window.innerWidth;
		if (this.screenwidth <= 768) {
			this.collapsed = false;
			this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
		}
	}

	constructor(private navigationService: NavigationService, private authService: AuthService) {
	}

	ngOnInit(): void {
		this.screenwidth = window.innerWidth;
		this.utilisateur = this.authService.getUtilisateurConnecte();
		this.construireMenusAutorises();
	}

	/**
	 * Construit les menus autorisés à l'utilisateur.
	 *
	 * @private
	 */
	private construireMenusAutorises() {
		if ([RoleUtils.ROLE_RESPONSABLE_CEL.code, RoleUtils.ROLE_SUPERVISEUR_REGIONAL.code]
			.includes(this.authService.getUtilisateurConnecte()?.role)) {
			this.navData = NavbarData.menusSansCarteInteractiveEtAdministration();
		} else if (RoleUtils.ROLE_DIRECTION_CENTRALE.code === this.authService.getUtilisateurConnecte()?.role) {
			this.navData = NavbarData.menusSansAdministration();
		} else if (RoleUtils.ROLE_ADMIN.code === this.authService.getUtilisateurConnecte()?.role) {
			this.navData = NavbarData.tousLesMenus();
		}
	}

	toggleCollapse(): void {
		this.collapsed = !this.collapsed;
		this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
	}

	toggleAdminItems(): void {
		if (!this.collapsed) {
			this.collapsed = true;
			this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
		}
	}

	handleClick(item: INavBarData): void {
		if (!this.multiple) {
			for (const modelItem of this.navData) {
				if (item !== modelItem && modelItem.expanded) {
					modelItem.expanded = false;
				}
			}
		}
		item.expanded = !item.expanded;
	}

	/**
	 * Méthode de déconnection.
	 *
	 * @constructor
	 */
	deconnecter(): void {
		localStorage.clear();
		this.navigationService.goToConnexion();
	}

	/**
	 * Retourne true si le menu est sélectionné.
	 *
	 * @param menu le menu.
	 * @return true si le menu est sélectionné.
	 */
	isMenuActive(menu: INavBarData): boolean {
		const url = window.location.href;
		return url.includes(menu.routerlink);
	}

	/**
	 * Ouvre la modal d'édition d'un utilisateur.
	 */
	ouvrirModalEditionPassword(): void {
		this.modalPasswodEditVisible = true;
	}

	/**
	 * Affiche les initiales de l'utilisateur connectés.
	 */
	afficherInitialesUtilisateurConnecte(): string {
		return this.utilisateur.prenoms.substring(0, 1).toUpperCase() + this.utilisateur.nom.substring(0, 1).toUpperCase();
	}

	afficherRoleUtilisateurConnecte(): string {
		return RoleUtils.getRole(this.utilisateur.role).designation;
	}
}
