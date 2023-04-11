import {ResultatCandidat} from "../model/resultat-candidat";

export class ResultatUtils {

	/**
	 * Retourne le canditat qui a le meilleur score.
	 *
	 * @param resultatCandidats la liste des résultats des candidats.
	 */
	public static meilleurCandidat(resultatCandidats: ResultatCandidat[]): ResultatCandidat {
		if (resultatCandidats?.length) {
			resultatCandidats.sort((resultatCandidat1, resultatCandidat2) => resultatCandidat2.score - resultatCandidat1.score);
			return resultatCandidats?.length > 1 && resultatCandidats[0].score > resultatCandidats[1].score ? resultatCandidats[0] : null;
		}
		return null;
	}

	/**
	 * Rajoute le code couleur du meilleur candidat.
	 *
	 * @param resultatCandidat resultat du candidat
	 * @param listeCandidats liste des candidats
	 * @returns
	 */
	public static couleurCandidat(resultatCandidat: ResultatCandidat, listeCandidats: ResultatCandidat[]): string {
		return resultatCandidat === this.meilleurCandidat(listeCandidats)  ? 'background:' + resultatCandidat.codeCouleur : '';
	}
}
