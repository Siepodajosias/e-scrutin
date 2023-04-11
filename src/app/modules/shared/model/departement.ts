import {Region} from "./region";
import {CodeDesignation} from "./code-designation";


export class Departement extends CodeDesignation {
	id: number;
	region: Region;
}
