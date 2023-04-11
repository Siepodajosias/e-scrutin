import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeResultat } from "./liste-resultat/liste-resultat";
import { BureauVoteResultatComponent } from 'src/app/modules/resultat/bureau-vote-resultat/bureau-vote-resultat.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'global', component: ListeResultat
			},
			{
				path: 'bureau-vote', component: BureauVoteResultatComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ResultatRoutingModule {
}
