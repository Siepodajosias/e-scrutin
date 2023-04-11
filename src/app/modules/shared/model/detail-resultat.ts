import { ResultatCandidat } from 'src/app/modules/shared/model/resultat-candidat';
import { CommissionLocale } from 'src/app/modules/shared/model/commission-locale';

export class DetailResultat {
	codeLieuVote: string;
	designationLieuVote: string;
	codeBureauVote: string;
	nombreInscrits: number;
	nombreHommesVotants: number;
	nombreFemmesVotantes: number;
	totalVotants: number;
	tauxParticipation: number;
	nombreBulletinsNuls: number;
	nombreBulletinsBlancs: number;
	commissionLocale: CommissionLocale;
	sufragesExprimes: number;
	resultatCandidats: ResultatCandidat[];
}
