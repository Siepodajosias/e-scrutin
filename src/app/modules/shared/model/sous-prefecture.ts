import {Departement} from "./departement";
import {CodeDesignation} from "./code-designation";

export class SousPrefecture extends CodeDesignation {
	id: number;
	departement: Departement;
}
