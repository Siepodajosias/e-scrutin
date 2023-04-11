import {Commune} from "./commune";

export class Election {
	code: string;
	designation: string;
	id: number;
	type: string;
	statut: string;
	Enum: any[];
	annee: number;
	circonscription: Commune;
}
