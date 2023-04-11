import {CodeDesignation} from "../model/code-designation";

export class RoleUtils {
	static ROLE_ADMIN = new CodeDesignation('ADMIN', 'Administrateur');
	static ROLE_DIRECTION_CENTRALE = new CodeDesignation('DIRECTION_CENTRALE', 'Direction centrale');
	static ROLE_SUPERVISEUR_REGIONAL = new CodeDesignation('SUPERVISEUR_REGIONAL', 'Superviseur régional');
	static ROLE_RESPONSABLE_CEL = new CodeDesignation('RESPONSABLE_CEL', 'Responsable CEL');

	/**
	 * Retourne tous les rôles.
	 */
	static tousLesRoles(): CodeDesignation[] {
		return [this.ROLE_ADMIN, this.ROLE_DIRECTION_CENTRALE, this.ROLE_RESPONSABLE_CEL, this.ROLE_SUPERVISEUR_REGIONAL];
	}

	/**
	 * Retourne le rôle dont le code est renseigné.
	 *
	 * @param codeRole le code du rôle.
	 */
	static getRole(codeRole: string) {
		return this.tousLesRoles().find(role => role.code === codeRole);
	}
}
