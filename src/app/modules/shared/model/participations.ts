import { Circonscription } from "./circonscription";
import { CommissionLocale } from "./commission-locale";
import { Region } from "./region";
import { CodeDesignation } from 'src/app/modules/shared/model/code-designation';

export class Participations {
	region: Region;
	circonscription: Circonscription;
	commissionLocale: CommissionLocale;
	bureauVote?: CodeDesignation;
	lieuVote?: CodeDesignation;
	nombreInscrits: number;
	totalParticipants: number;
	tauxParticipation: number;
}








