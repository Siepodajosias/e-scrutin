import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResultatCandidat } from "../../shared/model/resultat-candidat";
import { LigneResultat } from "../../shared/model/ligne-resultat";
import {ResultatUtils} from "../../shared/utils/resultat-utils";

@Component({
	selector: 'app-detail-resultat',
	templateUrl: './detail-resultat.html',
	styleUrls: ['./detail-resultat.scss']
})
export class DetailResultat implements OnInit {
	@Input()
	resultatDialog = true;
	@Input()
	ligneResultat: LigneResultat;
	meilleurcandidat: ResultatCandidat;
	titreDetailResultat: string;
	@Output()
	visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor() {}

	ngOnInit(): void {
		if (this.ligneResultat) {
			this.meilleurcandidat = this.meilleurCandidat(this.ligneResultat.resultatCandidats);
			this.ligneResultat.resultatCandidats.sort(this.comparer);
		}
		this.titreDetailResultat = 'Circonscription :' + this.ligneResultat.circonscription.designation;
	}

	/**
	 * Ferme la modal du détail résultat
	 */
	public fermerModal(): void {
		this.visibleChange.emit(false);
		this.resultatDialog = false;
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

	/**
	 * Trie le tableau du plus grand score au plus pétit
	 * @param resultatCandidat1
	 * @param resultatCandidat2
	 */
	public comparer(resultatCandidat1: ResultatCandidat, resultatCandidat2: ResultatCandidat): number {
		return resultatCandidat1.score > resultatCandidat2.score ? -1 : 1;
	}
}
