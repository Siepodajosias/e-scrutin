import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '**',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: '',
				redirectTo: 'connexion',
				pathMatch: 'full'
			},
			{
				path: 'connexion',
				loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
				// canActivate: [AuthGuard]
			},
			{
				path: 'tableau-de-bord',
				loadChildren: () => import('./modules/dashbord/dashbord.module').then(m => m.DashbordModule),
				// canActivate: [AuthGuard]
			},
			{
				path: 'participation',
				loadChildren: () => import('./modules/participation/participation.module').then(m => m.ParticipationModule),
				// canActivate: [AuthGuard]
			},
			{
				path: 'resultat',
				loadChildren: () => import('./modules/resultat/resultat.module').then(m => m.ResultatModule),
				// canActivate: [AuthGuard]
			},
			{
				path: 'carte-interactive',
				loadChildren: () => import('./modules/carte-interactive/carte-interactive.module').then(m => m.CarteInteractiveModule),
				// canActivate: [AuthGuard]
			},
			{
				path: 'administration',
				loadChildren: () => import('./modules/administration/administration.module').then(m => m.AdministrationModule),
				// canActivate: [AuthGuard]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
