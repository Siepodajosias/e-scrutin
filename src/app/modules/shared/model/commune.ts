import {SousPrefecture} from "./sous-prefecture";
import {CodeDesignation} from "./code-designation";

export class Commune extends CodeDesignation {
	id: number;
	sousPrefecture: SousPrefecture;
}
