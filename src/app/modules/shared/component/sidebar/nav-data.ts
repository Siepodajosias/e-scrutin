import { INavBarData } from './inavbadata';

export class NavbarData {
	private static menuTableauDeBord: INavBarData = {
		routerlink: 'tableau-de-bord',
		icon: 'pi pi-chart-bar',
		label: 'TABLEAU DE BORD',
		items: []
	};

	private static menuCarteInteractive: INavBarData = {
		routerlink: 'carte-interactive',
		icon: 'pi pi-map-marker',
		label: 'CARTE INTERACTIVE'
	};

	private static menuResultats: INavBarData = {
		routerlink: 'resultat',
		icon: 'pi pi-sliders-h',
		label: 'RESULTATS',
		expanded: false,
		items: [
			{
				routerlink: 'resultat/global',
				label: 'Résultats globaux',
				icon: 'pi pi-chart-line',
			},
			{
				routerlink: 'resultat/bureau-vote',
				label: 'Résultats détaillés',
				icon: 'pi pi-home',
			}
		]
	};

	private static menuParticipation: INavBarData = {
		routerlink: 'participation',
		icon: 'pi pi-send',
		label: 'PARTICIPATIONS',
		items: []
	};

	private static menuAdministration: INavBarData = {
		routerlink: 'administration',
		icon: 'pi pi-cog',
		label: 'ADMINISTRATION',
		expanded: false,
		items: [
			{
				routerlink: 'administration/utilisateur',
				label: 'Utilisateurs',
				icon: 'pi pi-users',
			},
			{
				routerlink: 'administration/version',
				label: 'Versions',
				icon: 'fa-solid fa-code-branch',
			}
		]
	};

	static tousLesMenus(): INavBarData[] {
		return [this.menuTableauDeBord, this.menuCarteInteractive,
			this.menuResultats, this.menuParticipation, this.menuAdministration];
	}

	static menusSansCarteInteractiveEtAdministration(): INavBarData[] {
		return [this.menuTableauDeBord, this.menuResultats, this.menuParticipation];
	}

	static menusSansAdministration(): INavBarData[] {
		return [this.menuTableauDeBord, this.menuCarteInteractive, this.menuResultats, this.menuParticipation];
	}
}

