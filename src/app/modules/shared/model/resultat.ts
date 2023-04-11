import {ResultatCandidat} from './resultat-candidat';
import { CodeDesignation } from 'src/app/modules/shared/model/code-designation';

export class Resultat {
	region: CodeDesignation;
	departement: CodeDesignation;
	sousPrefecture: CodeDesignation
	commune: CodeDesignation;
	deuxieme : ResultatCandidat; 
	premier: ResultatCandidat;
	resultats: ResultatCandidat[];
}
