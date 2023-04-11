import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Participations} from "../../shared/model/participations";
import {DonneesFiltre} from "../../shared/model/donnees-filtre";

@Component({
	selector: 'app-detail-participation',
	templateUrl: './detail-participation.html',
	styleUrls: ['./detail-participation.scss']
})
export class DetailParticipation implements OnInit {

	@Input() participationDialog = true;
	@Input() participation: Participations;
	@Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();

	constructor() {}

	ngOnInit(): void {
	}

	/**
	 * Récuperer la liste des participations en fonction du scrutin et du bureau de vote
	 */
	/*
	public recupererParticipationBureauVoteScrutin(): void {
		this.participationService.recupererParticipationBureauVoteScrutin(this.donneeFiltres.annee, this.donneeFiltres.typeScrutin,
			this.donneeFiltres.tour, this.participation.bureauVote.id).subscribe({
			next: (participation) => {
			}
		});
	}
*/
	/**
	 * Ferme la modal du détail participation
	 */
	public fermerModal(): void {
		this.visibleChange.emit(false);
		this.participationDialog = false;
	}
}
