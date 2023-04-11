import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Connexion } from './connexion/connexion';

const routes: Routes = [
	{
		path: '', component: Connexion
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LoginRoutingModule {
}
