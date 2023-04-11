import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeParticipation } from "./liste-participation/liste-participation";

const routes: Routes = [
	{
		path: '', component: ListeParticipation
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ParticipationRoutingModule {
}
