import {Participation} from "./participation";
import {CodeDesignation} from "./code-designation";

export class LieuVote extends CodeDesignation {
	id: number;
	codeCommune: string;
	designationCommune: string;
	codeSousPrefecture: string;
	designationSousPrefecture: string;
	codeDepartement: string;
	designationDepartement: string;
	codeRegion: string;
	designationRegion: string;
	longitude: number;
	latitude: number;
	participations: Participation[];
	participationAffiche: boolean;
	anomalies: string;
}
