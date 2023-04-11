import { VoixPartis } from './voix-partis.model';

export class DonneesTableauDeBord {
	nombreLieuVote: number;
	nombreBureauVote: number;
	nombreInscrits: number;
	nombreHommes: number;
	nombreFemmes: number;
	totalVotants: number;
	tauxParticipation: number;
	nombreBulletinsNuls: number;
	nombreBulletinsBlancs: number;
	suffragesExprimes: number;
	voixPartis: VoixPartis[];
	multipleCircnscription: boolean;
}
