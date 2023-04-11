import {Component, Input, OnInit} from '@angular/core';
import {ResultatCandidat} from '../../shared/model/resultat-candidat';
import {CodeDesignation} from "../../shared/model/code-designation";
import {ResultatUtils} from "../../shared/utils/resultat-utils";

@Component({
	selector: 'app-detail-resulat',
	templateUrl: './detail-resulat.component.html',
	styleUrls: ['./detail-resulat.component.scss']
})
export class DetailResulatComponent implements OnInit {

	@Input() resultats: ResultatCandidat[];
	@Input() zone: CodeDesignation;
	@Input() decoupage: string;


	ngOnInit() {
		this.resultats.sort((resultatCandidat1, resultatCandidat2) => resultatCandidat2.score - resultatCandidat1.score);
	}

	/**
	 * Retourne le canditat qui a le meilleur score.
	 *
	 * @param resultatCandidats la liste des résultats des candidats.
	 */
	public meilleurCandidat(resultatCandidats: ResultatCandidat[]): ResultatCandidat {
		return ResultatUtils.meilleurCandidat(resultatCandidats);
	}

	/**
	 * Rajoute le code couleur du meilleur candidat.
	 *
	 * @param resultatCandidat resultat du candidat
	 * @param listeCandidats liste des candidats
	 * @returns
	 */
	couleurCandidat(resultatCandidat: ResultatCandidat, listeCandidats: ResultatCandidat[]): string {
		return ResultatUtils.couleurCandidat(resultatCandidat, listeCandidats);
	}

}
