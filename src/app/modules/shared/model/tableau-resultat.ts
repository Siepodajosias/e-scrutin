import { ResultatCandidat } from 'src/app/modules/shared/model/resultat-candidat';
import { LigneResultat } from 'src/app/modules/shared/model/ligne-resultat';

export class TableauResultat {
	meilleurCandidat: ResultatCandidat;
    vainqueurMultiple: boolean;
	resultats: LigneResultat[];
}
