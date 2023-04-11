import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurComponent } from 'src/app/modules/administration/utilisateur/utilisateur.component';
import { VersionComponent } from 'src/app/modules/administration/version/version.component';

const routes: Routes = [
	{ path: 'utilisateur', component: UtilisateurComponent },
	{ path: 'version', component: VersionComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdministrationRoutingModule {
}
